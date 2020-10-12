import React from 'react';
import styled from '@stream-io/styled-components';

import PropTypes from 'prop-types';
import { emojiData } from '../../utils';
import { themed } from '../../styles/theme';
import MessageAvatar from './MessageAvatar';
import MessageContent from './MessageContent';
import MessageStatus from './MessageStatus';

const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: ${({ alignment }) =>
    alignment === 'left' ? 'flex-start' : 'flex-end'};
  margin-bottom: ${({ hasMarginBottom }) => (hasMarginBottom ? 10 : 0)};
  ${({ theme }) => theme.message.container.css};
`;

class MessageInner extends React.PureComponent {
  static propTypes = {
    reactionsEnabled: PropTypes.bool.isRequired,
    handleDelete: PropTypes.func,
    handleEdit: PropTypes.func,
    dismissKeyboard: PropTypes.func,
    handleAction: PropTypes.func,
    handleRetry: PropTypes.func,
    message: PropTypes.object,
    isMyMessage: PropTypes.func,
    groupStyles: PropTypes.array,
    client: PropTypes.object,
    readBy: PropTypes.array,
    forceAlign: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    showMessageStatus: PropTypes.bool,
    showReactionsList: PropTypes.bool,
    lastReceivedId: PropTypes.string,
    formatDate: PropTypes.func,
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
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    reactionsEnabled: true,
    forceAlign: false,
    showMessageStatus: false,
    supportedReactions: emojiData,
  };

  static themePath = 'message';

  constructor(props) {
    super(props);

    // State reactionPickerVisible has been lifeted up in MessageInner component
    // so that one can use ReactionPickerWrapper component outside MessageContent as well.
    // This way `Add Reaction` message action can trigger the ReactionPickerWrapper to
    // open the reaction picker.
    this.state = {
      reactionPickerVisible: false,
    };
  }

  openReactionPicker = async () => {
    const { disabled, readOnly } = this.props;
    if (disabled || readOnly) return;
    // Keyboard closes automatically whenever modal is opened (currently there is no way of avoiding this afaik)
    // So we need to postpone the calculation for reaction picker position
    // until after keyboard is closed completely. To achieve this, we close
    // the keyboard forcefully and then calculate position of picker in callback.
    await this.props.dismissKeyboard();
    this.setState({ reactionPickerVisible: true });
  };

  dismissReactionPicker = () => {
    this.setState({ reactionPickerVisible: false });
  };

  render() {
    const {
      message,
      isMyMessage,
      groupStyles,
      forceAlign,
      showMessageStatus,
      reactionsEnabled,
    } = this.props;

    let alignment;
    if (forceAlign && (forceAlign === 'left' || forceAlign === 'right'))
      alignment = forceAlign;
    else alignment = isMyMessage(message) ? 'right' : 'left';

    // const lastMessage = this.props.channel.state.messages[
    //   this.props.channel.state.messages.length - 1
    // ];
    // const isVeryLastMessage = lastMessage
    //   ? lastMessage.id === message.id
    //   : false;

    const hasMarginBottom = !!(
      groupStyles[0] === 'single' || groupStyles[0] === 'bottom'
    );

    const hasReactions =
      reactionsEnabled &&
      message.latest_reactions &&
      message.latest_reactions.length > 0;

    const forwardedProps = {
      ...this.props,
      reactionPickerVisible: this.state.reactionPickerVisible,
      openReactionPicker: this.openReactionPicker,
      dismissReactionPicker: this.dismissReactionPicker,
      alignment,
      groupStyles: hasReactions ? ['bottom'] : groupStyles,
    };

    return (
      <Container alignment={alignment} hasMarginBottom={hasMarginBottom}>
        {alignment === 'right' ? (
          <React.Fragment>
            <MessageContent {...forwardedProps} />
            <MessageAvatar {...forwardedProps} />
            {showMessageStatus && <MessageStatus {...forwardedProps} />}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MessageAvatar {...forwardedProps} />
            <MessageContent {...forwardedProps} />
          </React.Fragment>
        )}
      </Container>
    );
  }
}

export default themed(MessageInner);
