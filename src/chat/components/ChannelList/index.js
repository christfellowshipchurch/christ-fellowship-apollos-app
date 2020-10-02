import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Immutable from 'seamless-immutable';
import debounce from 'lodash/debounce';

import uniqBy from 'lodash/uniqBy';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';

import { withChatContext } from '../../context';
import {
  LoadingIndicator,
  LoadingErrorIndicator,
  EmptyStateIndicator,
} from '../Indicators';
import ChannelPreview from './ChannelPreview';
import ChannelListHeaderNetworkDownIndicator from './ChannelListHeaderNetworkDownIndicator';
import ChannelListHeaderErrorIndicator from './ChannelListHeaderErrorIndicator';
import ChannelListFooterLoadingIndicator from './ChannelListFooterLoadingIndicator';

export const DEFAULT_QUERY_CHANNELS_LIMIT = 10;
export const MAX_QUERY_CHANNELS_LIMIT = 30;

class ChannelList extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func,
    onMessageNew: PropTypes.func,
    onAddedToChannel: PropTypes.func,
    onRemovedFromChannel: PropTypes.func,
    onChannelUpdated: PropTypes.func,
    onChannelTruncated: PropTypes.func,
    onChannelDeleted: PropTypes.func,
    onChannelHidden: PropTypes.func,
    filters: PropTypes.object,
    options: PropTypes.object,
    sort: PropTypes.object,
    client: PropTypes.object,
    setActiveChannel: PropTypes.func,
    lockChannelOrder: PropTypes.bool,
    postFilter: PropTypes.func,
  };

  static defaultProps = {
    filters: {},
    options: {},
    sort: {},
    lockChannelOrder: false,
    postFilter: (channels) => channels,
  };

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      channels: Immutable([]),
      channelIds: Immutable([]),
      refreshing: false,
      loadingChannels: true,
      loadingNextPage: false,
      hasNextPage: true,
      offset: 0,
    };
    this.listRef = React.createRef();
    this.lastRefresh = new Date();
    this._queryChannelsDebounced = debounce(
      async (params = {}) => {
        await this.queryChannelsPromise;
        if (this.state.error) {
          return;
        }

        if (!this.state.hasNextPage) {
          return;
        }

        this.queryChannels(params.queryType);
      },
      1000,
      {
        leading: true,
        trailing: true,
      }
    );
    this._unmounted = false;
  }

  async componentDidMount() {
    await this.queryChannels('reload');
    this.listenToChanges();
  }

  async componentDidUpdate(prevProps) {
    // do we need deepequal?
    if (
      !isEqual(prevProps.filters, this.props.filters) ||
      !isEqual(prevProps.sort, this.props.sort)
    ) {
      this._queryChannelsDebounced.cancel();
      await this.queryChannels('reload');
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
    this.props.client.off(this.handleEvent);
    this._queryChannelsDebounced.cancel();
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.warn(error, error.isUnmounted, info);
  }

  setStateAsync = (newState) => {
    if (this._unmounted) {
      this._queryChannelsDebounced.cancel();
      return;
    }

    return new Promise((resolve) => {
      this.setState(newState, resolve);
    });
  };

  wait = (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  queryChannelsRequest = async (filters, sort, options, retryCount = 1) => {
    let channelQueryResponse;
    try {
      channelQueryResponse = await this.props.client.queryChannels(
        filters,
        sort,
        options
      );
    } catch (e) {
      // Wait for 2 seconds before making another attempt
      await this.wait(2000);
      // Don't try more than 3 times.
      if (retryCount === 3) {
        throw e;
      }
      return this.queryChannelsRequest(filters, sort, options, retryCount + 1);
    }

    return channelQueryResponse;
  };

  getQueryParams = (queryType) => {
    const { options, filters, sort } = this.props;
    let offset;
    let limit;

    if (queryType === 'refresh' || queryType === 'reload') {
      offset = 0;
      limit = MAX_QUERY_CHANNELS_LIMIT;
      if (this.state.channels.length === 0) {
        limit = options.limit || DEFAULT_QUERY_CHANNELS_LIMIT;
      } else if (this.state.channels.length < MAX_QUERY_CHANNELS_LIMIT) {
        limit = Math.max(
          this.state.channels.length,
          DEFAULT_QUERY_CHANNELS_LIMIT
        );
      }
    } else {
      limit = options.limit || DEFAULT_QUERY_CHANNELS_LIMIT;
      offset = this.state.offset;
    }

    const queryOptions = {
      ...options,
      offset,
      limit,
    };

    return {
      filters,
      sort,
      options: queryOptions,
    };
  };

  setRefreshingUIState = () =>
    this.setStateAsync({
      refreshing: true,
      loadingChannels: false,
      loadingNextPage: false,
    });

  setReloadingUIState = () =>
    this.setStateAsync({
      refreshing: false,
      loadingChannels: true,
      loadingNextPage: false,
      error: false,
      channels: Immutable([]),
      channelIds: Immutable([]),
    });

  setLoadingNextPageUIState = () =>
    this.setStateAsync({
      refreshing: false,
      loadingChannels: false,
      loadingNextPage: true,
    });

  // Sets the loading UI state before the star
  startQueryLoadingUIState = async (queryType) => {
    switch (queryType) {
      case 'refresh':
        await this.setRefreshingUIState();
        break;
      case 'reload':
        await this.setReloadingUIState();
        break;
      default:
        await this.setLoadingNextPageUIState();
        break;
    }
  };

  finishQueryLoadingUIState = () =>
    this.setStateAsync({
      refreshing: false,
      loadingChannels: false,
      loadingNextPage: false,
    });

  /**
   * queryType - 'refresh' | 'reload'
   *
   * refresh - Refresh the channel list. You will see the existing channels during refreshing.a
   *  Mainly used for pull to refresh or resyning upong network recovery.
   *
   * reload  - Reload the channel list from begining. You won't see existing channels during reload.
   */
  queryChannels = (queryType) => {
    // Don't query again if query is already active or there are no more results.
    // eslint-disable-next-line no-async-promise-executor
    this.queryChannelsPromise = new Promise(async (resolve) => {
      try {
        await this.startQueryLoadingUIState(queryType);

        const { filters, sort, options } = this.getQueryParams(queryType);
        const channelQueryResponse = await this.queryChannelsRequest(
          filters,
          sort,
          options
        );

        // Set the active channel only in case of reload.
        if (queryType === 'reload' && channelQueryResponse.length >= 1) {
          this.props.setActiveChannel(channelQueryResponse[0]);
        }

        this.finishQueryLoadingUIState();
        const hasNextPage =
          channelQueryResponse.length >=
          (options.limit || DEFAULT_QUERY_CHANNELS_LIMIT);

        if (queryType === 'refresh' || queryType === 'reload') {
          await this.setChannels(channelQueryResponse, {
            hasNextPage,
            error: false,
          });
        } else {
          await this.appendChannels(channelQueryResponse, {
            hasNextPage,
            error: false,
          });
        }

        resolve(true);
      } catch (e) {
        await this.handleError(e);

        resolve(false);
      }
    });

    return this.queryChannelsPromise;
  };

  handleError = () => {
    this._queryChannelsDebounced.cancel();
    this.finishQueryLoadingUIState();
    return this.setStateAsync({
      error: true,
    });
  };

  appendChannels = (channels = [], additionalState = {}) => {
    // Remove duplicate channels in worse case we get repeted channel from backend.
    let distinctChannels = channels.filter(
      (c) => this.state.channelIds.indexOf(c.id) === -1
    );

    distinctChannels = [
      ...this.state.channels,
      this.props.postFilter(...distinctChannels),
    ];
    const channelIds = [
      ...this.state.channelIds,
      ...distinctChannels.map((c) => c.id),
    ];

    return this.setStateAsync({
      channels: distinctChannels,
      channelIds,
      offset: distinctChannels.length,
      ...additionalState,
    });
  };

  setChannels = (channels = [], additionalState = {}) => {
    const distinctChannels = [...this.props.postFilter(channels)];
    const channelIds = [...channels.map((c) => c.id)];

    return this.setStateAsync({
      channels: distinctChannels,
      channelIds,
      offset: distinctChannels.length,
      ...additionalState,
    });
  };

  listenToChanges() {
    this.props.client.on(this.handleEvent);
  }

  handleEvent = async (e) => {
    if (e.type === 'channel.hidden') {
      if (
        this.props.onChannelHidden &&
        typeof this.props.onChannelHidden === 'function'
      ) {
        this.props.onChannelHidden(this, e);
      } else {
        const channels = this.state.channels;
        const channelIndex = channels.findIndex(
          (channel) => channel.cid === e.cid
        );

        if (channelIndex < 0) return;

        // Remove the hidden channel from the list.
        channels.splice(channelIndex, 1);
        this.setStateAsync({
          channels: [...channels],
        });
      }
    }

    if (e.type === 'user.presence.changed' || e.type === 'user.updated') {
      let newChannels = this.state.channels;

      newChannels = newChannels.map((channel) => {
        if (!channel.state.members[e.user.id]) return channel;

        channel.state.members.setIn([e.user.id, 'user'], e.user);

        return channel;
      });

      this.setStateAsync({ channels: [...newChannels] });
    }

    if (e.type === 'message.new') {
      !this.props.lockChannelOrder && this.moveChannelUp(e.cid);
    }

    // make sure to re-render the channel list after connection is recovered
    if (e.type === 'connection.recovered') {
      this._queryChannelsDebounced.cancel();
      this.queryChannels('refresh');
    }

    // move channel to start
    if (e.type === 'notification.message_new') {
      if (
        this.props.onMessageNew &&
        typeof this.props.onMessageNew === 'function'
      ) {
        this.props.onMessageNew(this, e);
      } else {
        const channel = await this.getChannel(e.channel.type, e.channel.id);

        // move channel to starting position
        if (this._unmounted) return;
        this.setState((prevState) => ({
          channels: uniqBy([channel, ...prevState.channels], 'cid'),
          channelIds: uniqWith([channel.id, ...prevState.channelIds], isEqual),
          offset: prevState.offset + 1,
        }));
      }
    }

    // add to channel
    if (e.type === 'notification.added_to_channel') {
      if (
        this.props.onAddedToChannel &&
        typeof this.props.onAddedToChannel === 'function'
      ) {
        this.props.onAddedToChannel(this, e);
      } else {
        const channel = await this.getChannel(e.channel.type, e.channel.id);

        if (this._unmounted) return;
        this.setState((prevState) => ({
          channels: uniqBy([channel, ...prevState.channels], 'cid'),
          channelIds: uniqWith([channel.id, ...prevState.channelIds], isEqual),
          offset: prevState.offset + 1,
        }));
      }
    }

    // remove from channel
    if (e.type === 'notification.removed_from_channel') {
      if (
        this.props.onRemovedFromChannel &&
        typeof this.props.onRemovedFromChannel === 'function'
      ) {
        this.props.onRemovedFromChannel(this, e);
      } else {
        if (this._unmounted) return;
        this.setState((prevState) => {
          const channels = prevState.channels.filter(
            (channel) => channel.cid !== e.channel.cid
          );
          const channelIds = prevState.channelIds.filter(
            (cid) => cid !== e.channel.cid
          );
          return {
            channels,
            channelIds,
          };
        });
      }
    }

    // Channel data is updated
    if (e.type === 'channel.updated') {
      const channels = this.state.channels;
      const channelIndex = channels.findIndex(
        (channel) => channel.cid === e.channel.cid
      );

      if (channelIndex > -1) {
        channels[channelIndex].data = Immutable(e.channel);
        this.setStateAsync({
          channels: [...channels],
        });
      }

      if (
        this.props.onChannelUpdated &&
        typeof this.props.onChannelUpdated === 'function'
      )
        this.props.onChannelUpdated(this, e);
    }

    // Channel is deleted
    if (e.type === 'channel.deleted') {
      if (
        this.props.onChannelDeleted &&
        typeof this.props.onChannelDeleted === 'function'
      ) {
        this.props.onChannelDeleted(this, e);
      } else {
        const channels = this.state.channels;
        const channelIndex = channels.findIndex(
          (channel) => channel.cid === e.channel.cid
        );

        if (channelIndex < 0) return;

        // Remove the deleted channel from the list.
        channels.splice(channelIndex, 1);
        this.setStateAsync({
          channels: [...channels],
        });
      }
    }

    if (e.type === 'channel.truncated') {
      this.setState((prevState) => ({
        channels: [...prevState.channels],
      }));

      if (
        this.props.onChannelTruncated &&
        typeof this.props.onChannelTruncated === 'function'
      )
        this.props.onChannelTruncated(this, e);
    }

    return null;
  };

  getChannel = async (type, id) => {
    const channel = this.props.client.channel(type, id);
    await channel.watch();
    return channel;
  };

  moveChannelUp = (cid) => {
    if (this._unmounted) return;
    const channels = this.state.channels;

    // get channel index
    const channelIndex = this.state.channels.findIndex(
      (channel) => channel.cid === cid
    );
    if (channelIndex <= 0) return;

    // get channel from channels
    const channel = channels[channelIndex];

    // remove channel from current position
    channels.splice(channelIndex, 1);
    // add channel at the start
    channels.unshift(channel);

    // set new channel state
    if (this._unmounted) return;
    this.setStateAsync({
      channels: [...channels],
    });
  };

  // Refreshes the list. Existing list of channels will still be visible on UI while refreshing.
  refreshList = async () => {
    const now = new Date();
    // Only allow pull-to-refresh 10 seconds after last successful refresh.
    if (now - this.lastRefresh < 10000 && !this.state.error) {
      return;
    }

    // if (!this.state.error) return;
    this.listRef.scrollToIndex({ index: 0 });
    this._queryChannelsDebounced.cancel();
    const success = await this.queryChannels('refresh');

    if (success) this.lastRefresh = new Date();
  };

  // Reloads the channel list. All the existing channels will be wiped out first from UI, and then
  // queryChannels api will be called to fetch new channels.
  reloadList = () => {
    this._queryChannelsDebounced.cancel();
    this.queryChannels('reload');
  };

  loadNextPage = () => {
    this._queryChannelsDebounced();
  };

  renderLoading = () => <LoadingIndicator listType="channel" />;

  renderLoadingError = () => (
    <LoadingErrorIndicator
      error={this.state.error}
      retry={this.reloadList}
      listType="channel"
      loadNextPage={this.loadNextPage}
    />
  );

  renderEmptyState = () => <EmptyStateIndicator listType="channel" />;

  renderHeaderIndicator = () => {
    const { isOnline, error } = this.props;

    if (!isOnline) {
      return <ChannelListHeaderNetworkDownIndicator />;
    }

    if (error) {
      return <ChannelListHeaderErrorIndicator onPress={this.refreshList} />;
    }
  };

  renderChannels = () => (
    <>
      {this.renderHeaderIndicator()}
      <FlatList
        style={{ flex: 1 }}
        ref={(flRef) => {
          this.listRef = flRef;
        }}
        data={this.state.channels}
        onEndReached={() => this.loadNextPage(false)}
        onRefresh={() => this.refreshList()}
        refreshing={this.state.refreshing}
        onEndReachedThreshold={this.props.loadMoreThreshold}
        ListEmptyComponent={this.renderEmptyState}
        ListFooterComponent={() => {
          if (this.state.loadingNextPage) {
            return <ChannelListFooterLoadingIndicator />;
          }

          return null;
        }}
        renderItem={({ item: channel }) => (
          <ChannelPreview
            {...this.props}
            setActiveChannel={this.props.onSelect}
            key={channel.cid}
            channel={channel}
          />
        )}
        keyExtractor={(item) => item.cid}
      />
    </>
  );

  render() {
    if (this.state.error && this.state.channels.length === 0) {
      return this.renderLoadingError();
    }
    if (this.state.loadingChannels) {
      return this.renderLoading();
    }
    return this.renderChannels();
  }
}

export default withChatContext(ChannelList);
