import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import Immutable from 'seamless-immutable';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { emojiData } from '../utils';

import {
  LoadingIndicator,
  LoadingErrorIndicator,
  EmptyStateIndicator,
} from './Indicators';
import { KeyboardCompatibleView } from './KeyboardCompatibleView';

import { ChannelContext, withChatContext, withTranslationContext } from '../context';
import { logChatPromiseExecution } from 'stream-chat';

/**
 * This component is not really exposed externally, and is only supposed to be used with
 * 'Channel' component (which is actually exposed to customers).
 */
class ChannelInner extends PureComponent {
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

    this.props.logger('Channel component', 'Constructor', {
      props: this.props,
      state: this.state,
    });
  }

  static propTypes = {
    /** Which channel to connect to */
    channel: PropTypes.shape({
      watch: PropTypes.func,
    }).isRequired,
    /** Client is passed via the Chat Context */
    client: PropTypes.object.isRequired,
    /** The loading indicator to use */
    LoadingIndicator: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.elementType,
    ]),
    /** The indicator to use when there is error  */
    LoadingErrorIndicator: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.elementType,
    ]),
    /** The indicator to use when message list is empty */
    EmptyStateIndicator: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.elementType,
    ]),
    isOnline: PropTypes.bool,
    Message: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
    /**
     * Override mark channel read request (Advanced usage only)
     *
     * @param channel Channel object
     * */
    doMarkReadRequest: PropTypes.func,
    /**
     * Override send message request (Advanced usage only)
     *
     * @param channelId
     * @param messageData Message object
     * */
    doSendMessageRequest: PropTypes.func,
    /**
     * Override update message request (Advanced usage only)
     * @param channelId
     * @param updatedMessage UpdatedMessage object
     * */
    doUpdateMessageRequest: PropTypes.func,
    /** Disables the channel UI if channel is frozen */
    disableIfFrozenChannel: PropTypes.bool,
    /**
     * If true, KeyboardCompatibleView wrapper is disabled.
     *
     * Channel component internally uses [KeyboardCompatibleView](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/KeyboardCompatibleView.js) component
     * internally to adjust the height of Channel component when keyboard is opened or dismissed. This prop gives you ability to disable this functionality, in case if you
     * want to use [KeyboardAvoidingView](https://facebook.github.io/react-native/docs/keyboardavoidingview) or you want to handle keyboard dismissal yourself.
     * KeyboardAvoidingView works well when your component occupies 100% of screen height, otherwise it may raise some issues.
     * */
    disableKeyboardCompatibleView: PropTypes.bool,
    /**
     * Custom wrapper component that handles height adjustment of Channel component when keyboard is opened or dismissed.
     * Defaults to [KeyboardCompatibleView](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/KeyboardCompatibleView.js)
     *
     * This prop can be used to configure default KeyboardCompatibleView component.
     * e.g.,
     * <Channel
     *  channel={channel}
     *  ...
     *  KeyboardCompatibleView={(props) => {
     *    return (
     *      <KeyboardCompatibleView keyboardDismissAnimationDuration={200} keyboardOpenAnimationDuration={200}>
     *        {props.children}
     *      </KeyboardCompatibleView>
     *    )
     *  }}
     * />
     */
    KeyboardCompatibleView: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.elementType,
    ]),
  };

  static defaultProps = {
    disableKeyboardCompatibleView: false,
    disableIfFrozenChannel: true,
    KeyboardCompatibleView,
    LoadingIndicator,
    LoadingErrorIndicator,
    EmptyStateIndicator,
    emojiData,
    logger: () => {},
  };

  async componentDidUpdate(prevProps) {
    this.props.logger('Channel component', 'componentDidUpdate', {
      tags: ['lifecycle', 'channel'],
      props: this.props,
      state: this.state,
    });

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

  getInitialStateFromProps(props) {
    return {
      error: false,
      // Loading the initial content of the channel
      loading: true,
      // Loading more messages
      loadingMore: false,
      hasMore: true,
      messages: Immutable([]),
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
    };
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

  async componentDidMount() {
    this.props.logger('Channel component', 'componentDidMount', {
      tags: ['lifecycle', 'channel'],
      props: this.props,
      state: this.state,
    });
    await this.initChannel();
  }

  componentWillUnmount() {
    this.props.logger('Channel component', 'componentWillUnmount', {
      tags: ['lifecycle', 'channel'],
      props: this.props,
      state: this.state,
    });

    this.props.channel.off(this.handleEvent);
    this.props.client.off('connection.recovered', this.handleEvent);

    this._loadMoreFinishedDebounced.cancel();
    this._setStateThrottled.cancel();
    this._unmounted = true;
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

  markRead = () => {
    if (
      this.props.channel.disconnected ||
      !this.props.channel.getConfig().read_events
    ) {
      return;
    }

    const { doMarkReadRequest, channel } = this.props;

    if (doMarkReadRequest) {
      doMarkReadRequest(channel);
    } else {
      logChatPromiseExecution(channel.markRead(), 'mark read');
    }
  };

  listenToChanges() {
    // The more complex sync logic is done in chat.js
    // listen to client.connection.recovered and all channel events
    this.props.client.on('connection.recovered', this.handleEvent);
    const channel = this.props.channel;
    channel.on(this.handleEvent);
  }

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

  removeEphemeralMessages() {
    const c = this.props.channel;
    c.state.selectRegularMessages();
    if (this._unmounted) return;
    this.setState({ messages: c.state.messages });
  }

  createMessagePreview = (
    text,
    parent,
    extraFields,
  ) => {
    // create a preview of the message
    const clientSideID = `${this.props.client.userID}-` + uuidv4();
    const message = {
      text,
      html: text,
      __html: text,
      //id: tmpID,
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
  editMessage = async (updatedMessage) => {
    if (this.props.doUpdateMessageRequest) {
      return Promise.resolve(
        this.props.doUpdateMessageRequest(
          this.props.channel.cid,
          updatedMessage,
        ),
      );
    }

    return this.props.client.updateMessage(updatedMessage);
  };

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
      let messageResponse;
      if (this.props.doSendMessageRequest) {
        messageResponse = await this.props.doSendMessageRequest(
          this.props.channel.cid,
          messageData,
        );
      } else {
        messageResponse = await this.props.channel.sendMessage(messageData);
      }

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

  sendMessage = async ({
    text,
    parent,
    ...extraFields
  }) => {
    // remove error messages upon submit
    this.props.channel.state.filterErrorMessages();

    // create a local preview message to show in the UI
    const messagePreview = this.createMessagePreview(
      text,
      parent,
      extraFields,
    );

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
    this._setStateThrottled({
      messages: channel.state.messages,
      watchers: channel.state.watchers,
      read: channel.state.read,
      typing: channel.state.typing,
      watcher_count: channel.state.watcher_count,
    });
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
    this.props.logger('Channel Component', 'Requerying the messages', {
      props: this.props,
      state: this.state,
      limit: perPage,
      id_lt: oldestID,
    });
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
    Message: this.props.Message,
    updateMessage: this.updateMessage,
    removeMessage: this.removeMessage,
    sendMessage: this.sendMessage,
    editMessage: this.editMessage,
    retrySendMessage: this.retrySendMessage,
    setEditingState: this.setEditingState,
    clearEditingState: this.clearEditingState,
    EmptyStateIndicator: this.props.EmptyStateIndicator,
    markRead: this._markReadThrottled,
    loadMore: this._loadMoreThrottled,
    emojiData: this.props.emojiData,
    disabled:
      this.props.channel.data &&
      this.props.channel.data.frozen &&
      this.props.disableIfFrozenChannel,
  });

  renderLoading = () => {
    const Indicator = this.props.LoadingIndicator;
    return <Indicator listType='message' />;
  };

  renderLoadingError = () => {
    const Indicator = this.props.LoadingErrorIndicator;
    return <Indicator error={this.state.error} listType='message' />;
  };

  render() {
    let core;
    const { children, KeyboardCompatibleView, t } = this.props;
    if (this.state.error) {
      this.props.logger(
        'Channel component',
        'Error loading channel - rendering error indicator',
        {
          tags: ['error', 'channelComponent'],
          props: this.props,
          state: this.state,
          error: this.state.error,
        },
      );

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
          enabled={!this.props.disableKeyboardCompatibleView}
        >
          <ChannelContext.Provider value={this.getContext()}>
            <View collapsable={false} style={{ height: '100%' }}>
              {children}
            </View>
          </ChannelContext.Provider>
        </KeyboardCompatibleView>
      );
    }

    return <View style={{ height: '100%' }}>{core}</View>;
  }
}

const Channel = withTranslationContext(withChatContext(ChannelInner));

export { Channel };
