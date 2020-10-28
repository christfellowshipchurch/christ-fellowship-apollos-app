import React from 'react';
import styled from '@stream-io/styled-components';
import PropTypes from 'prop-types';
import { connectActionSheet } from '@expo/react-native-action-sheet';

import Avatar from '../Avatar';
import { withTranslationContext } from '../../context';
import { themed } from '../../styles/theme';

const AVATAR_ACTIONS = {
  message: 'message',
  mute: 'mute',
  unmute: 'unmute',
  ban: 'ban',
};

const Container = styled.TouchableOpacity`
  margin-right: ${({ alignment }) => (alignment === 'left' ? 8 : 0)};
  margin-left: ${({ alignment }) => (alignment === 'right' ? 8 : 0)};
  ${({ theme }) => theme.message.avatarWrapper.container.css};
`;

const Spacer = styled.View`
  width: 32;
  height: 28;
  ${({ theme }) => theme.message.avatarWrapper.spacer.css};
`;

class MessageAvatar extends React.PureComponent {
  static themePath = 'message.avatarWrapper';

  static propTypes = {
    message: PropTypes.object,
    alignment: PropTypes.string,
    showAvatar: PropTypes.bool,
    groupStyles: PropTypes.array,
    handleMute: PropTypes.func,
    handleUnmute: PropTypes.func,
    handleBan: PropTypes.func,
    handleSendMessage: PropTypes.func,
    dismissKeyboard: PropTypes.func,
    showActionSheetWithOptions: PropTypes.func,
    canMuteUser: PropTypes.func,
    canUnmuteUser: PropTypes.func,
    canBanUser: PropTypes.func,
    canMessageUser: PropTypes.func,
    t: PropTypes.func,
  };

  showActionSheet = async () => {
    await this.props.dismissKeyboard();

    const {
      canMuteUser,
      canUnmuteUser,
      canBanUser,
      canMessageUser,
      t,
    } = this.props;

    const options = [{ id: 'cancel', title: t('Cancel') }];

    if (canMessageUser()) {
      options.push({
        id: AVATAR_ACTIONS.message,
        title: 'Send Person A Message',
      });
    }

    if (canMuteUser()) {
      options.push({
        id: AVATAR_ACTIONS.mute,
        title: 'Mute Person',
      });
    }

    if (canUnmuteUser()) {
      options.push({
        id: AVATAR_ACTIONS.unmute,
        title: 'Unmute Person',
      });
    }

    if (canBanUser()) {
      options.push({
        id: AVATAR_ACTIONS.ban,
        title: 'Ban Person',
      });
    }

    if (options.length === 1) return;

    this.props.showActionSheetWithOptions(
      {
        title: t('Choose an action'),
        options: options.map((o) => o.title),
        cancelButtonIndex: 0,
        destructiveButtonIndex: options.findIndex(
          (o) => o.id === AVATAR_ACTIONS.ban
        ),
      },
      (buttonIndex) => this.onActionPress(options[buttonIndex].id)
    );
  };

  onActionPress = (action) => {
    switch (action) {
      case AVATAR_ACTIONS.message:
        this.props.handleSendMessage();
        break;
      case AVATAR_ACTIONS.mute:
        this.props.handleMute();
        break;
      case AVATAR_ACTIONS.unmute:
        this.props.handleUnmute();
        break;
      case AVATAR_ACTIONS.ban:
        this.props.showActionSheetWithOptions(
          {
            title: 'Ban person for remainder of event?',
            options: ['Cancel', 'Ban Person'],
            destructiveButtonIndex: 1,
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
    const { message, alignment, groupStyles, showAvatar = null } = this.props;

    let visible = showAvatar;

    if (visible === null) {
      visible = !!(groupStyles[0] === 'single' || groupStyles[0] === 'bottom');
    }

    return (
      <Container alignment={alignment} onLongPress={this.showActionSheet}>
        {visible ? (
          <Avatar
            image={message.user.image}
            name={message.user.name || message.user.id}
          />
        ) : (
          <Spacer />
        )}
      </Container>
    );
  }
}

export default connectActionSheet(
  withTranslationContext(themed(MessageAvatar))
);
