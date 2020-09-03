import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import deepequal from 'deep-equal';

import { withKeyboardContext } from '../../context';
import MessageInner from './MessageInner';

class Message extends React.Component {
  static themePath = 'message';

  static extraThemePaths = ['avatar'];

  static propTypes = {
    message: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    readBy: PropTypes.array,
    groupStyles: PropTypes.array,
    editing: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    lastReceivedId: PropTypes.string,
    setEditingState: PropTypes.func,
    updateMessage: PropTypes.func,
    removeMessage: PropTypes.func,
    retrySendMessage: PropTypes.func,
    openThread: PropTypes.func,
    dismissKeyboard: PropTypes.func,
    onMessageTouch: PropTypes.func,
    dismissKeyboardOnMessageTouch: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    readBy: [],
    groupStyles: [],
    editing: false,
    dismissKeyboardOnMessageTouch: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  shouldComponentUpdate(nextProps) {
    // since there are many messages its important to only rerender messages when needed.
    let shouldUpdate = nextProps.message !== this.props.message;
    // read state is the next most likely thing to change..
    if (!shouldUpdate && !deepequal(nextProps.readBy, this.props.readBy)) {
      shouldUpdate = true;
    }
    // group style often changes for the last 3 messages...
    if (
      !shouldUpdate &&
      !deepequal(nextProps.groupStyles, this.props.groupStyles)
    ) {
      shouldUpdate = true;
    }

    // if lastreceivedId changes, message should update.
    if (
      !shouldUpdate &&
      !deepequal(nextProps.lastReceivedId, this.props.lastReceivedId)
    ) {
      shouldUpdate = true;
    }

    // editing is the last one which can trigger a change..
    if (!shouldUpdate && nextProps.editing !== this.props.editing) {
      shouldUpdate = true;
    }

    // editing is the last one which can trigger a change..
    if (!shouldUpdate && nextProps.disabled !== this.props.disabled) {
      shouldUpdate = true;
    }

    if (
      !shouldUpdate &&
      nextProps.dismissKeyboard !== this.props.dismissKeyboard
    ) {
      shouldUpdate = true;
    }

    return shouldUpdate;
  }

  isMyMessage = (message) => this.props.client.user.id === message.user.id;

  isAdmin = () =>
    this.props.client.user.role === 'admin' ||
    (this.props.channel.state &&
      this.props.channel.state.membership &&
      this.props.channel.state.membership.role === 'admin');

  isOwner = () =>
    this.props.channel.state &&
    this.props.channel.state.membership &&
    this.props.channel.state.membership.role === 'owner';

  isModerator = () =>
    this.props.channel.state &&
    this.props.channel.state.membership &&
    (this.props.channel.state.membership.role === 'channel_moderator' ||
      this.props.channel.state.membership.role === 'moderator');

  canEditMessage = () =>
    this.isMyMessage(this.props.message) ||
    this.isModerator() ||
    this.isOwner() ||
    this.isAdmin();

  canDeleteMessage = () => this.canEditMessage();

  handleFlag = async (event) => {
    event?.preventDefault?.();

    const message = this.props.message;
    await this.props.client.flagMessage(message.id);
  };

  handleMute = async (event) => {
    event?.preventDefault?.();

    const message = this.props.message;
    await this.props.client.flagMessage(message.user.id);
  };

  handleEdit = () => {
    this.props.setEditingState(this.props.message);
  };

  handleDelete = async () => {
    const message = this.props.message;
    const data = await this.props.client.deleteMessage(message.id);
    this.props.updateMessage(data.message);
  };

  handleReaction = async (reactionType, event) => {
    event?.preventDefault?.();

    let userExistingReaction = null;

    const currentUser = this.props.client.userID;
    for (const reaction of this.props.message.own_reactions) {
      // own user should only ever contain the current user id
      // just in case we check to prevent bugs with message updates from breaking reactions
      if (
        currentUser === reaction.user.id &&
        reaction.type === reactionType
      ) {
        userExistingReaction = reaction;
      } else if (currentUser !== reaction.user.id) {
        console.warn(
          `message.own_reactions contained reactions from a different user, this indicates a bug`
        );
      }
    }

    const originalMessage = this.props.message;
    let reactionChangePromise;

    /*
  - Add the reaction to the local state
  - Make the API call in the background
  - If it fails, revert to the old message...
  */
    if (userExistingReaction) {
      this.props.channel.state.removeReaction(userExistingReaction);

      reactionChangePromise = this.props.channel.deleteReaction(
        this.props.message.id,
        userExistingReaction.type
      );
    } else {
      // add the reaction
      const messageID = this.props.message.id;
      const tmpReaction = {
        message_id: messageID,
        user: this.props.client.user,
        type: reactionType,
        created_at: new Date(),
      };
      const reaction = { type: reactionType };

      this.props.channel.state.addReaction(tmpReaction);
      reactionChangePromise = this.props.channel.sendReaction(
        messageID,
        reaction
      );
    }

    try {
      // only wait for the API call after the state is updated
      await reactionChangePromise;
    } catch (e) {
      // revert to the original message if the API call fails
      this.props.updateMessage(originalMessage);
    }
  };

  handleAction = async (name, value, event) => {
    event?.preventDefault?.();
    const messageID = this.props.message.id;
    const formData = {};
    formData[name] = value;

    const data = await this.props.channel.sendAction(messageID, formData);

    if (data && data.message) {
      this.props.updateMessage(data.message);
    } else {
      this.props.removeMessage(this.props.message);
    }
  };

  handleRetry = async (message) => {
    await this.props.retrySendMessage(message);
  };

  onMessageTouch = (e, message) => {
    const {
      onMessageTouch,
      dismissKeyboardOnMessageTouch,
      dismissKeyboard,
    } = this.props;

    if (onMessageTouch) onMessageTouch(e, message);
    if (dismissKeyboardOnMessageTouch) dismissKeyboard();
  };

  getTotalReactionCount = (supportedReactions) => {
    const { emojiData } = this.props;
    let count = null;
    if (!supportedReactions) {
      supportedReactions = emojiData;
    }

    const reactionCounts = this.props.message.reaction_counts;

    if (
      reactionCounts !== null &&
      reactionCounts !== undefined &&
      Object.keys(reactionCounts).length > 0
    ) {
      count = 0;
      Object.keys(reactionCounts).map((key) => {
        if (supportedReactions.find((e) => e.id === key)) {
          count += reactionCounts[key];
        }

        return count;
      });
    }
    return count;
  };

  render() {
    const message = this.props.message;

    const actionsEnabled =
      message.type === 'regular' && message.status === 'received';

    const actionProps = {};

    if (this.props.channel && this.props.channel.getConfig()) {
      actionProps.reactionsEnabled = this.props.channel.getConfig().reactions;
    }

    return (
      <TouchableOpacity
        onPress={(e) => {
          this.onMessageTouch(e, message);
        }}
        activeOpacity={1}
      >
        <MessageInner
          {...this.props}
          {...actionProps}
          client={this.props.client}
          channel={this.props.channel}
          actionsEnabled={actionsEnabled}
          Message={this}
          onMessageTouch={(e) => {
            this.onMessageTouch(e, message);
          }}
          handleReaction={this.handleReaction}
          getTotalReactionCount={this.getTotalReactionCount}
          handleFlag={this.handleFlag}
          handleMute={this.handleMute}
          handleAction={this.handleAction}
          handleRetry={this.handleRetry}
          isMyMessage={this.isMyMessage}
          isAdmin={this.isAdmin}
          isModerator={this.isModerator}
          canEditMessage={this.canEditMessage}
          canDeleteMessage={this.canDeleteMessage}
          handleEdit={this.handleEdit}
          handleDelete={this.handleDelete}
          openThread={
            this.props.openThread && this.props.openThread.bind(this, message)
          }
        />
      </TouchableOpacity>
    );
  }
}

export default withKeyboardContext(Message);
