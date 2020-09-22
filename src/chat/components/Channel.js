import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import Immutable from 'seamless-immutable';
import { debounce, throttle, get } from 'lodash';
import { logChatPromiseExecution } from 'stream-chat';
import { emojiData } from '../utils';

import {
  ChannelContext,
  withChatContext,
  withTranslationContext,
  withPlayerContext,
} from '../context';
import { LoadingIndicator, LoadingErrorIndicator } from './Indicators';
import { KeyboardCompatibleView } from './KeyboardCompatibleView';

class Channel extends PureComponent {
  static propTypes = {
    channel: PropTypes.shape({
      watch: PropTypes.func,
    }).isRequired,
    client: PropTypes.object.isRequired,
    isOnline: PropTypes.bool,
    disableIfFrozenChannel: PropTypes.bool,
    disableKeyboardCompatibleView: PropTypes.bool,
    isBannerOpen: PropTypes.bool,
    bannerHeight: PropTypes.number,
  };

  static defaultProps = {
    disableKeyboardCompatibleView: false,
    disableIfFrozenChannel: true,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialStateFromProps(props);
    // hard limit to prevent you from scrolling faster than 1 page per 2 seconds
    this._loadMoreFinishedDebounced = debounce(this.loadMoreFinished, 2000, {
      leading: true,
      trailing: true,
    });

    this._loadMoreThrottled = throttle(this.loadMore, 2000, {
      leading: true,
      trailing: true,
    });

    this._setStateThrottled = throttle(this.setState, 500, {
      leading: true,
      trailing: true,
    });

    this._markReadThrottled = throttle(this.markRead, 500, {
      leading: true,
      trailing: true,
    });

    this.messageInputBox = false;
  }

  async componentDidMount() {
    await this.initChannel();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isOnline !== prevProps.isOnline) {
      if (this._unmounted) return;
      this.setState({ online: this.props.isOnline });
    }

    if (this.props.channel.id !== prevProps.channel.id) {
      const resetState = this.getInitialStateFromProps(this.props);
      this.setState(resetState);
      await this.initChannel();
    }
  }

  componentWillUnmount() {
    this.props.channel.off(this.handleEvent);
    this.props.client.off('connection.recovered', this.handleEvent);

    this._loadMoreFinishedDebounced.cancel();
    this._setStateThrottled.cancel();
    this._unmounted = true;
  }

  getInitialStateFromProps = (props) => ({
    error: false,
    // Loading the initial content of the channel
    loading: true,
    // Loading more messages
    loadingMore: false,
    hasMore: true,
    messages: Immutable([]),
    mutes: Immutable(
      get(props, 'client.user.mutes', []).map((o) => ({
        muted_at: o.created_at,
        id: o.target.id,
      }))
    ),
    online: props.isOnline,
    typing: Immutable({}),
    watchers: Immutable({}),
    members: Immutable({}),
    read: Immutable({}),
    /** We save the events in state so that we can display event message
     * next to the message after which it was received, in MessageList.
     *
     * e.g., eventHistory = {
     *   message_id_1: [
     *     { ...event_obj_received_after_message_id_1__1 },
     *     { ...event_obj_received_after_message_id_1__2 },
     *     { ...event_obj_received_after_message_id_1__3 },
     *   ],
     *   message_id_2: [
     *     { ...event_obj_received_after_message_id_2__1 },
     *     { ...event_obj_received_after_message_id_2__2 },
     *     { ...event_obj_received_after_message_id_2__3 },
     *   ]
     * }
     */
    eventHistory: {},
  });

  markRead = () => {
    if (
      this.props.channel.disconnected ||
      !this.props.channel.getConfig().read_events
    ) {
      return;
    }

    const { channel } = this.props;

    logChatPromiseExecution(channel.markRead(), 'mark read');
  };

  setEditingState = (message) => {
    if (this._unmounted) return;
    this.setState({
      editing: message,
    });
  };

  updateMessage = (updatedMessage, extraState) => {
    const channel = this.props.channel;

    extraState = extraState || {};

    // adds the message to the local channel state..
    // this adds to both the main channel state as well as any reply threads
    channel.state.addMessageSorted(updatedMessage);

    // update the Channel component state
    if (this._unmounted) return;
    this.setState({ messages: channel.state.messages, ...extraState });
  };

  clearEditingState = () => {
    if (this._unmounted) return;
    this.setState({
      editing: false,
    });
  };

  removeMessage = (message) => {
    const channel = this.props.channel;
    channel.state.removeMessage(message);
    if (this._unmounted) return;
    this.setState({ messages: channel.state.messages });
  };

  createMessagePreview = (text, parent, extraFields) => {
    // create a preview of the message
    const clientSideID = `${this.props.client.userID}-${uuidv4()}`;
    const message = {
      text,
      html: text,
      __html: text,
      // id: tmpID,
      id: clientSideID,
      type: 'regular',
      status: 'sending',
      user: {
        id: this.props.client.userID,
        ...this.props.client.user,
      },
      created_at: new Date(),
      reactions: [],
      ...extraFields,
    };

    if (parent && parent.id) {
      message.parent_id = parent.id;
    }
    return message;
  };

  // eslint-disable-next-line require-await
  editMessage = async (updatedMessage) =>
    this.props.client.updateMessage(updatedMessage);

  _sendMessage = async (message) => {
    // Scrape the reserved fields if present.
    const {
      text,
      id,
      parent_id,
      html,
      __html,
      type,
      status,
      user,
      created_at,
      reactions,
      ...extraFields
    } = message;

    const messageData = {
      text,
      id,
      parent_id,
      ...extraFields,
    };

    try {
      const messageResponse = await this.props.channel.sendMessage(messageData);

      // replace it after send is completed
      if (messageResponse.message) {
        messageResponse.message.status = 'received';
        this.updateMessage(messageResponse.message);
      }
    } catch (error) {
      console.log(error);
      // set the message to failed..
      message.status = 'failed';
      this.updateMessage(message);
    }
  };

  sendMessage = async ({ text, parent, ...extraFields }) => {
    // remove error messages upon submit
    this.props.channel.state.filterErrorMessages();

    // create a local preview message to show in the UI
    const messagePreview = this.createMessagePreview(text, parent, extraFields);

    // first we add the message to the UI
    this.updateMessage(messagePreview, {
      messageInput: '',
      commands: [],
      userAutocomplete: [],
    });

    await this._sendMessage(messagePreview);
  };

  retrySendMessage = async (message) => {
    // set the message status to sending
    message = message.asMutable();
    message.status = 'sending';
    this.updateMessage(message);
    // actually try to send the message...
    await this._sendMessage(message);
  };

  handleEvent = (e) => {
    const { channel } = this.props;

    if (e.type === 'member.added') {
      this.addToEventHistory(e);
    }
    if (e.type === 'member.removed') {
      this.addToEventHistory(e);
    }
    const newState = {
      messages: channel.state.messages,
      watchers: channel.state.watchers,
      read: channel.state.read,
      typing: channel.state.typing,
      watcher_count: channel.state.watcher_count,
    };
    if (e.type === 'notification.mutes_updated') {
      newState.mutes = get(e, 'me.mutes', []).map((o) => ({
        muted_at: o.created_at,
        id: o.target.id,
      }));
    }
    this._setStateThrottled(newState);
  };

  addToEventHistory = (e) => {
    this.setState((prevState) => {
      const lastMessageId =
        prevState.messages.length > 0
          ? prevState.messages[prevState.messages.length - 1].id
          : 'none';

      if (!prevState.eventHistory[lastMessageId])
        return {
          ...prevState,
          eventHistory: {
            ...prevState.eventHistory,
            [lastMessageId]: [e],
          },
        };

      return {
        ...prevState,
        eventHistory: {
          ...prevState.eventHistory,
          [lastMessageId]: [...prevState.eventHistory[lastMessageId], e],
        },
      };
    });
  };

  loadMore = async () => {
    // prevent duplicate loading events...
    if (this.state.loadingMore || !this.state.hasMore) return;
    if (this._unmounted) return;
    this.setState({ loadingMore: true });

    if (!this.state.messages.length === 0) {
      this.setState({
        loadingMore: false,
      });

      return;
    }

    const oldestMessage = this.state.messages[0]
      ? this.state.messages[0]
      : null;

    if (oldestMessage && oldestMessage.status !== 'received') {
      this.setState({
        loadingMore: false,
      });

      return;
    }

    const oldestID = oldestMessage ? oldestMessage.id : null;
    const perPage = 100;
    let queryResponse;
    try {
      queryResponse = await this.props.channel.query({
        messages: { limit: perPage, id_lt: oldestID },
      });
    } catch (e) {
      console.warn('message pagination request failed with error', e);
      if (this._unmounted) return;
      this.setState({ loadingMore: false });
      return;
    }
    const hasMore = queryResponse.messages.length === perPage;

    this._loadMoreFinishedDebounced(hasMore, this.props.channel.state.messages);
  };

  loadMoreFinished = (hasMore, messages) => {
    if (this._unmounted) return;
    this.setState({
      loadingMore: false,
      hasMore,
      messages,
    });
  };

  getContext = () => ({
    ...this.state,
    client: this.props.client,
    channel: this.props.channel,
    updateMessage: this.updateMessage,
    removeMessage: this.removeMessage,
    sendMessage: this.sendMessage,
    editMessage: this.editMessage,
    retrySendMessage: this.retrySendMessage,
    setEditingState: this.setEditingState,
    clearEditingState: this.clearEditingState,
    markRead: this._markReadThrottled,
    loadMore: this._loadMoreThrottled,
    emojiData,
    disabled:
      this.props.channel.data &&
      this.props.channel.data.frozen &&
      this.props.disableIfFrozenChannel,
  });

  removeEphemeralMessages() {
    const c = this.props.channel;
    c.state.selectRegularMessages();
    if (this._unmounted) return;
    this.setState({ messages: c.state.messages });
  }

  listenToChanges() {
    this.props.client.on('connection.recovered', this.handleEvent);
    this.props.client.on('notification.mutes_updated', this.handleEvent);
    const channel = this.props.channel;
    channel.on(this.handleEvent);
  }

  copyChannelState() {
    const channel = this.props.channel;

    if (this._unmounted) return;
    this.setState({
      messages: channel.state.messages,
      read: channel.state.read,
      watchers: channel.state.watchers,
      members: channel.state.members,
      watcher_count: channel.state.watcher_count,
      loading: false,
      typing: Immutable({}),
    });

    if (channel.countUnread() > 0) this.markRead();
  }

  async initChannel() {
    const channel = this.props.channel;
    let errored = false;
    if (!channel.initialized) {
      try {
        await channel.watch();
      } catch (e) {
        if (this._unmounted) return;
        this.setState({ error: e });
        errored = true;
      }
    }

    this.lastRead = new Date();
    if (!errored) {
      this.copyChannelState();
      this.listenToChanges();
    }
  }

  renderLoading = () => {
    const Indicator = LoadingIndicator;
    return <Indicator listType="message" />;
  };

  renderLoadingError = () => {
    const Indicator = LoadingErrorIndicator;
    return <Indicator error={this.state.error} listType="message" />;
  };

  render() {
    let core;
    const { children, t } = this.props;
    if (this.state.error) {
      core = this.renderLoadingError();
    } else if (this.state.loading) {
      core = this.renderLoading();
    } else if (!this.props.channel || !this.props.channel.watch) {
      core = (
        <View>
          <Text>{t('Channel Missing')}</Text>
        </View>
      );
    } else {
      core = (
        <KeyboardCompatibleView
          isBannerOpen={this.props.isBannerOpen}
          bannerHeight={this.props.bannerHeight}
          enabled={!this.props.disableKeyboardCompatibleView}
        >
          <ChannelContext.Provider value={this.getContext()}>
            {children}
          </ChannelContext.Provider>
        </KeyboardCompatibleView>
      );
    }

    return core;
  }
}

export default withTranslationContext(
  withPlayerContext(withChatContext(Channel))
);
