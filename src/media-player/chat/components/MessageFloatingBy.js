import React, { PureComponent } from 'react';
import { View } from 'react-native';
import styled from '@stream-io/styled-components';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import { withChannelContext, withTranslationContext } from '../context';
import Message from './Message';

const ListContainer = styled.FlatList`
  flex: 1;
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  ${({ theme }) => theme.messageList.listContainer.css};
`;

class MessageFloatingBy extends PureComponent {
  static propTypes = {
    noGroupByUser: PropTypes.bool,
    client: PropTypes.object,
    messages: PropTypes.array.isRequired,
    read: PropTypes.object,
    onMessageTouch: PropTypes.func,
    dismissKeyboardOnMessageTouch: PropTypes.bool,
    eventHistory: PropTypes.object,
    markRead: PropTypes.func,
    loadMore: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    noGroupByUser: false,
    dismissKeyboardOnMessageTouch: true,
  };

  constructor(props) {
    super(props);

    this.state = {};
    this.yOffset = 0;
  }

  componentDidMount() {
    this.setLastReceived(this.props.messages);
  }

  componentDidUpdate(prevProps) {
    // handle new messages being sent/received
    const currentLastMessage = this.props.messages[
      this.props.messages.length - 1
    ];
    const previousLastMessage =
      prevProps.messages[prevProps.messages.length - 1];
    if (!previousLastMessage || !currentLastMessage) {
      return;
    }

    const hasNewMessage = currentLastMessage.id !== previousLastMessage.id;
    const userScrolledUp = this.yOffset > 0;
    const isOwner = currentLastMessage.user.id === this.props.client.userID;

    let scrollToBottom = false;

    // always scroll down when it's your own message that you added...
    if (hasNewMessage && isOwner) {
      scrollToBottom = true;
    } else if (hasNewMessage && !userScrolledUp) {
      scrollToBottom = true;
    }

    if (scrollToBottom) {
      this.flatList.scrollToIndex({ index: 0 });
    }

    this.setLastReceived(this.props.messages);
  }

  insertDates = (messages) => {
    const newMessages = [];
    if (messages.length === 0) {
      this.props.eventHistory &&
        this.props.eventHistory.none &&
        this.props.eventHistory.none.forEach((e) => {
          newMessages.push({
            type: 'channel.event',
            event: e,
          });
        });

      return newMessages;
    }

    for (const [i, message] of messages.entries()) {
      if (message.type === 'message.read' || message.deleted_at) {
        newMessages.push(message);
        continue;
      }

      const messageDate = message.created_at.getDay();
      let prevMessageDate = messageDate;

      if (i < messages.length - 1) {
        prevMessageDate = messages[i + 1].created_at.getDay();
      }

      if (i === 0) {
        newMessages.push(
          {
            type: 'message.date',
            date: message.created_at,
          },
          message
        );
      } else if (messageDate !== prevMessageDate) {
        newMessages.push(message, {
          type: 'message.date',
          date: messages[i + 1].created_at,
        });
      } else {
        newMessages.push(message);
      }

      const eventsNextToMessage = this.props.eventHistory[message.id];
      if (eventsNextToMessage && eventsNextToMessage.length > 0) {
        eventsNextToMessage.forEach((e) => {
          newMessages.push({
            type: 'channel.event',
            event: e,
          });
        });
      }
    }

    return newMessages;
  };

  getGroupStyles = (m) => {
    const l = m.length;
    const messageGroupStyles = {};

    const messages = [...m];

    for (let i = 0; i < l; i++) {
      const previousMessage = messages[i - 1];
      const message = messages[i];
      const nextMessage = messages[i + 1];
      const groupStyles = [];

      if (message.type === 'channel.event') {
        continue;
      }

      if (message.type === 'message.date') {
        continue;
      }

      const userId = message.user ? message.user.id : null;

      const isTopMessage =
        !previousMessage ||
        previousMessage.type === 'message.date' ||
        previousMessage.type === 'system' ||
        previousMessage.type === 'channel.event' ||
        userId !== previousMessage.user.id ||
        previousMessage.type === 'error' ||
        previousMessage.deleted_at;

      const isBottomMessage =
        !nextMessage ||
        nextMessage.type === 'message.date' ||
        nextMessage.type === 'system' ||
        nextMessage.type === 'channel.event' ||
        userId !== nextMessage.user.id ||
        nextMessage.type === 'error' ||
        nextMessage.deleted_at;

      if (isTopMessage) {
        groupStyles.push('top');
      }

      if (isBottomMessage) {
        if (isTopMessage || message.deleted_at || message.type === 'error') {
          groupStyles.splice(0, groupStyles.length);
          groupStyles.push('single');
        } else {
          groupStyles.push('bottom');
        }
      }

      if (!isTopMessage && !isBottomMessage) {
        if (message.deleted_at || message.type === 'error') {
          groupStyles.splice(0, groupStyles.length);
          groupStyles.push('single');
        } else {
          groupStyles.splice(0, groupStyles.length);
          groupStyles.push('middle');
        }
      }

      if (this.props.noGroupByUser) {
        groupStyles.splice(0, groupStyles.length);
        groupStyles.push('single');
      }

      messageGroupStyles[message.id] = groupStyles;
    }

    return messageGroupStyles;
  };

  setLastReceived = (messages) => {
    const l = messages.length;
    let lastReceivedId = null;

    for (let i = l; i > 0; i--) {
      if (
        messages[i] !== undefined &&
        messages[i].status !== undefined &&
        messages[i].status === 'received'
      ) {
        lastReceivedId = messages[i].id;
        break;
      }
    }

    if (this.state.lastReceivedId !== lastReceivedId) {
      this.setState({ lastReceivedId });
    }
  };

  getReadStates = (messages) => {
    // create object with empty array for each message id
    const readData = {};

    for (const message of messages) {
      // Filter out date seperators
      if (!message || !message.id) {
        continue;
      }
      readData[message.id] = [];
    }

    for (const readState of Object.values(this.props.read)) {
      if (readState.last_read == null) {
        break;
      }
      let userLastReadMsgId;
      for (const msg of messages) {
        if (msg.updated_at < readState.last_read) {
          userLastReadMsgId = msg.id;
        }
      }
      if (userLastReadMsgId) {
        readData[userLastReadMsgId] = [
          ...readData[userLastReadMsgId],
          readState.user,
        ];
      }
    }

    return readData;
  };

  isMuted = (message) =>
    !!this.props.muted.find(
      (target) =>
        target.id === message.user.id &&
        new Date(target.muted_at).toString() <
          new Date(message.created_at).toString()
    );

  renderItem = (message, groupStyles) => {
    if (message.type === 'message.date') {
      return null;
    }
    if (message.type === 'channel.event') {
      return null;
    }
    if (message.type === 'system') {
      return null;
    }
    if (this.isMuted(message)) {
      return null;
    }
    if (message.type !== 'message.read') {
      const readBy = this.readData[message.id] || [];
      return (
        <Message
          client={this.props.client}
          channel={this.props.channel}
          message={message}
          muted={this.props.muted}
          groupStyles={groupStyles}
          readBy={readBy}
          disabled={this.props.disabled}
          lastReceivedId={
            this.state.lastReceivedId === message.id
              ? this.state.lastReceivedId
              : null
          }
          onMessageTouch={this.props.onMessageTouch}
          dismissKeyboardOnMessageTouch={
            this.props.dismissKeyboardOnMessageTouch
          }
          updateMessage={this.props.updateMessage}
          removeMessage={this.props.removeMessage}
          retrySendMessage={this.props.retrySendMessage}
          emojiData={this.props.emojiData}
        />
      );
    }
  };

  handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const removeNewMessageNotification = yOffset <= 0;
    if (removeNewMessageNotification && this.props.channel.countUnread() > 0)
      this.props.markRead();

    this.yOffset = yOffset;
  };

  render() {
    const { t } = this.props;
    const hasEventHistory =
      this.props.eventHistory &&
      Object.keys(this.props.eventHistory).length > 0;

    // We can't provide ListEmptyComponent to FlatList when inverted flag is set.
    // https://github.com/facebook/react-native/issues/21196
    if (
      this.props.messages &&
      this.props.messages.length === 0 &&
      !hasEventHistory
    ) {
      return <View style={{ flex: 1 }} />;
    }

    const messagesWithDates = this.insertDates(this.props.messages);
    const messageGroupStyles = this.getGroupStyles(messagesWithDates);
    this.readData = this.getReadStates(messagesWithDates);
    messagesWithDates.reverse();

    return (
      <ListContainer
        ref={(fl) => {
          this.flatList = fl;
        }}
        data={messagesWithDates}
        onScroll={this.handleScroll}
        onEndReached={this.props.loadMore}
        inverted
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) =>
          item.id ||
          item.created_at ||
          (item.date ? item.date.toISOString() : false) ||
          uuidv4()
        }
        renderItem={({ item: message }) =>
          this.renderItem(message, messageGroupStyles[message.id])
        }
        /** Disables the MessageList UI. Which means, message actions, reactions won't work. */
        extraData={this.props.disabled}
        maintainVisibleContentPosition={{
          minIndexForVisible: 1,
          autoscrollToTopThreshold: 10,
        }}
      />
    );
  }
}

export default withTranslationContext(withChannelContext(MessageFloatingBy));
