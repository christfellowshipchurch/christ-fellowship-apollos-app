import React from 'react';
import styled from '@stream-io/styled-components';
import Immutable from 'seamless-immutable';
import PropTypes from 'prop-types';
import { connectActionSheet } from '@expo/react-native-action-sheet';

import { MessageContentContext, withTranslationContext } from '../../context';
import { themed } from '../../styles/theme';

import { ReactionList, ReactionPickerWrapper } from '../Reaction';

import { emojiData } from '../../utils';
import MessageTextContainer from './MessageTextContainer';

const MESSAGE_ACTIONS = {
  edit: 'edit',
  delete: 'delete',
  reactions: 'reactions',
  message: 'message',
  flag: 'flag',
  mute: 'mute',
  unmute: 'unmute',
  ban: 'ban',
};

// Border radii are useful for the case of error message types only.
// Otherwise background is transparent, so border radius is not really visible.
const Container = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  max-width: 250;
  padding: ${({ error }) => (error ? 5 : 0)}px;
  align-items: ${({ alignment }) =>
    alignment === 'left' ? 'flex-start' : 'flex-end'};
  justify-content: ${({ alignment }) =>
    alignment === 'left' ? 'flex-start' : 'flex-end'};
  background-color: ${({ error, theme }) =>
    error
      ? theme.message.content.errorContainer.backgroundColor
      : theme.colors.transparent};
  border-bottom-left-radius: ${({ alignment, theme }) =>
    alignment === 'left'
      ? theme.message.content.container.borderRadiusS
      : theme.message.content.container.borderRadiusL};
  border-bottom-right-radius: ${({ alignment, theme }) =>
    alignment === 'left'
      ? theme.message.content.container.borderRadiusL
      : theme.message.content.container.borderRadiusS};
  border-top-left-radius: ${({ theme }) =>
    theme.message.content.container.borderRadiusL};
  border-top-right-radius: ${({ theme }) =>
    theme.message.content.container.borderRadiusL};
  ${({ theme }) => theme.message.content.container.css};
`;

const ContainerInner = styled.View`
  align-items: ${({ alignment }) =>
    alignment === 'left' ? 'flex-start' : 'flex-end'};
  ${({ theme }) => theme.message.content.containerInner.css};
`;

const MetaContainer = styled.View`
  margin-top: 2;
  ${({ theme }) => theme.message.content.metaContainer.css};
`;

const MetaText = styled.Text`
  font-size: 11;
  color: ${({ theme }) => theme.colors.textGrey};
  text-align: ${({ alignment }) => (alignment === 'left' ? 'left' : 'right')};
  ${({ theme }) => theme.message.content.metaText.css};
`;

const DeletedContainer = styled.View`
  display: flex;
  flex-direction: column;
  max-width: 250;
  padding: 5px;
  align-items: ${({ alignment }) =>
    alignment === 'left' ? 'flex-start' : 'flex-end'};
  justify-content: ${({ alignment }) =>
    alignment === 'left' ? 'flex-start' : 'flex-end'};
  ${({ theme }) => theme.message.content.deletedContainer.css};
`;

const DeletedText = styled.Text`
  font-size: 15;
  line-height: 20;
  color: #a4a4a4;
  ${({ theme }) => theme.message.content.deletedText.css};
`;

const FailedText = styled.Text`
  color: #a4a4a4;
  margin-right: 5px;
`;

class MessageContent extends React.PureComponent {
  static themePath = 'message.content';

  static propTypes = {
    reactionsEnabled: PropTypes.bool.isRequired,
    onMessageTouch: PropTypes.func,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    handleEdit: PropTypes.func,
    handleDelete: PropTypes.func,
    handleFlag: PropTypes.func,
    handleMute: PropTypes.func,
    handleUnmute: PropTypes.func,
    handleBan: PropTypes.func,
    handleSendMessage: PropTypes.func,
    dismissKeyboard: PropTypes.func,
    handleAction: PropTypes.func,
    alignment: PropTypes.oneOf(['right', 'left']),
    groupStyles: PropTypes.array,
    /**
     * e.g.,
     * [
     *  {
     *    id: 'like',
     *    icon: '👍',
     *  },
     *  {
     *    id: 'love',
     *    icon: '❤️️',
     *  },
     *  {
     *    id: 'haha',
     *    icon: '😂',
     *  },
     *  {
     *    id: 'wow',
     *    icon: '😮',
     *  },
     * ]
     */
    supportedReactions: PropTypes.array,
    openReactionPicker: PropTypes.func,
    dismissReactionPicker: PropTypes.func,
    reactionPickerVisible: PropTypes.bool,
    formatDate: PropTypes.func,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    showActionSheetWithOptions: PropTypes.func,
    canEditMessage: PropTypes.func,
    canDeleteMessage: PropTypes.func,
    canFlagMessage: PropTypes.func,
    canMuteUser: PropTypes.func,
    canUnmuteUser: PropTypes.func,
    canBanUser: PropTypes.func,
    canMessageUser: PropTypes.func,
    t: PropTypes.func,
  };

  static defaultProps = {
    reactionsEnabled: true,
    supportedReactions: emojiData,
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  showActionSheet = async () => {
    await this.props.dismissKeyboard();

    const {
      reactionsEnabled,
      canEditMessage,
      canDeleteMessage,
      canFlagMessage,
      canMuteUser,
      canUnmuteUser,
      canBanUser,
      canMessageUser,
      t,
    } = this.props;

    const options = [{ id: 'cancel', title: t('Cancel') }];

    if (reactionsEnabled) {
      options.push({
        id: MESSAGE_ACTIONS.reactions,
        title: t('Add Reaction'),
      });
    }

    if (canMessageUser()) {
      options.push({
        id: MESSAGE_ACTIONS.message,
        title: 'Send Person A Message',
      });
    }

    if (canEditMessage()) {
      options.push({
        id: MESSAGE_ACTIONS.edit,
        title: t('Edit Message'),
      });
    }

    if (canFlagMessage()) {
      options.push({
        id: MESSAGE_ACTIONS.flag,
        title: 'Report Message',
      });
    }

    if (canDeleteMessage()) {
      options.push({
        id: MESSAGE_ACTIONS.delete,
        title: t('Delete Message'),
      });
    }

    if (canMuteUser()) {
      options.push({
        id: MESSAGE_ACTIONS.mute,
        title: 'Mute Person',
      });
    }

    if (canUnmuteUser()) {
      options.push({
        id: MESSAGE_ACTIONS.unmute,
        title: 'Unmute Person',
      });
    }

    if (canBanUser()) {
      options.push({
        id: MESSAGE_ACTIONS.ban,
        title: 'Ban Person',
      });
    }

    this.props.showActionSheetWithOptions(
      {
        title: t('Choose an action'),
        options: options.map((o) => o.title),
        cancelButtonIndex: 0,
        destructiveButtonIndex: options.findIndex(
          (o) => o.id === MESSAGE_ACTIONS.delete
        ),
      },
      (buttonIndex) => this.onActionPress(options[buttonIndex].id)
    );
  };

  /**
   * @todo: Remove the method in future 1.0.0.
   * This method has been moved to `ReactionPickerWrapper`.
   *
   * @deprecated
   */
  _setReactionPickerPosition = async () => {
    console.warn(
      'openReactionSelector has been deprecared and will be removed in next major release.' +
        'Please use this.props.openReactionPicker instead.'
    );

    await this.props.openReactionPicker();
  };

  openReactionSelector = async () => {
    console.warn(
      'openReactionSelector has been deprecared and will be removed in next major release.' +
        'Please use this.props.openReactionPicker instead.'
    );

    await this.props.openReactionPicker();
  };

  onActionPress = (action) => {
    switch (action) {
      case MESSAGE_ACTIONS.reactions:
        this.props.openReactionPicker();
        break;
      case MESSAGE_ACTIONS.message:
        this.props.handleSendMessage();
        break;
      case MESSAGE_ACTIONS.edit:
        this.props.handleEdit();
        break;
      case MESSAGE_ACTIONS.delete:
        this.props.handleDelete();
        break;
      case MESSAGE_ACTIONS.flag:
        this.props.handleFlag();
        break;
      case MESSAGE_ACTIONS.mute:
        this.props.handleMute();
        break;
      case MESSAGE_ACTIONS.unmute:
        this.props.handleUnmute();
        break;
      case MESSAGE_ACTIONS.ban:
        this.props.showActionSheetWithOptions(
          {
            title: 'Ban person for remainder of event?',
            options: ['Cancel', 'Ban Person'],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex) this.props.handleBan();
          }
        );
        break;
      default:
        break;
    }
  };

  render() {
    const {
      alignment,
      message,
      isMyMessage,
      readOnly,
      disabled,
      Message,
      handleReaction,
      retrySendMessage,
      groupStyles,
      reactionsEnabled,
      getTotalReactionCount,
      supportedReactions,
      openReactionPicker,
      dismissReactionPicker,
      reactionPickerVisible,
      handleAction,
      channel,
      t,
      tDateTimeParser,
    } = this.props;

    const showTime = groupStyles[0] === 'single' || groupStyles[0] === 'bottom';

    const hasReactions =
      reactionsEnabled &&
      message.latest_reactions &&
      message.latest_reactions.length > 0;

    if (message.deleted_at)
      return (
        <DeletedContainer alignment={alignment}>
          <DeletedText>{t('This message was deleted ...')}</DeletedText>
        </DeletedContainer>
      );

    const onLongPress = this.props.onLongPress;
    const contentProps = {
      alignment,
      status: message.status,
      onPress: this.props.onPress
        ? this.props.onPress.bind(this, this, message)
        : this.props.onMessageTouch,
      onLongPress:
        onLongPress && !(disabled || readOnly)
          ? onLongPress.bind(this, this, message)
          : !(disabled || readOnly)
            ? this.showActionSheet
            : () => null,
      activeOpacity: 0.7,
      disabled: disabled || readOnly,
      hasReactions,
    };

    if (message.status === 'failed')
      contentProps.onPress = retrySendMessage.bind(this, Immutable(message));

    const context = {
      onLongPress: contentProps.onLongPress,
      disabled: disabled || readOnly,
    };

    return (
      <MessageContentContext.Provider value={context}>
        <Container
          {...contentProps}
          error={message.type === 'error' || message.status === 'failed'}
        >
          {message.type === 'error' ? (
            <FailedText>{t('ERROR · UNSENT')}</FailedText>
          ) : null}
          {message.status === 'failed' ? (
            <FailedText>{t('Message failed - try again')}</FailedText>
          ) : null}
          {reactionsEnabled &&
            ReactionList && (
              <ReactionPickerWrapper
                reactionPickerVisible={reactionPickerVisible}
                handleReaction={handleReaction}
                openReactionPicker={openReactionPicker}
                dismissReactionPicker={dismissReactionPicker}
                message={message}
                alignment={alignment}
                offset={{
                  top: 25,
                  left: 10,
                  right: 10,
                }}
                supportedReactions={supportedReactions}
              >
                {message.latest_reactions &&
                  message.latest_reactions.length > 0 && (
                    <ReactionList
                      alignment={alignment}
                      visible={!reactionPickerVisible}
                      latestReactions={message.latest_reactions}
                      getTotalReactionCount={getTotalReactionCount}
                      reactionCounts={message.reaction_counts}
                      supportedReactions={supportedReactions}
                    />
                  )}
              </ReactionPickerWrapper>
            )}
          {/* Reason for collapsible: https://github.com/facebook/react-native/issues/12966 */}
          <ContainerInner
            alignment={alignment}
            ref={(o) => (this.messageContainer = o)}
            collapsable={false}
          >
            <MessageTextContainer
              message={message}
              groupStyles={groupStyles}
              isMyMessage={isMyMessage}
              disabled={message.status === 'failed' || message.type === 'error'}
              alignment={alignment}
              Message={Message}
              handleReaction={handleReaction}
            />
          </ContainerInner>
          {showTime ? (
            <MetaContainer>
              <MetaText alignment={alignment}>
                {this.props.formatDate
                  ? this.props.formatDate(message.created_at)
                  : tDateTimeParser(message.created_at).format('LT')}
              </MetaText>
            </MetaContainer>
          ) : null}
        </Container>
      </MessageContentContext.Provider>
    );
  }
}

export default connectActionSheet(
  withTranslationContext(themed(MessageContent))
);
