import React, { PureComponent } from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';
import styled from '@stream-io/styled-components';

import { logChatPromiseExecution } from 'stream-chat';

import {
  withChannelContext,
  withKeyboardContext,
  withTranslationContext,
} from '../context';
import iconEdit from '../images/icons/icon_edit.png';
import iconSendNewMessage from '../images/icons/icon_new_message.png';

import { themed } from '../styles/theme';

import iconClose from '../images/icons/icon_close.png';

const Container = styled(({ padding, ...rest }) => <View {...rest} />)`
  display: flex;
  flex-direction: column;
  border-radius: 10;
  background-color: rgba(0, 0, 0, 0.05);
  padding-top: ${({ theme, padding }) =>
    padding ? theme.messageInput.container.conditionalPadding : 0}px;
  margin-left: 10px;
  margin-right: 10px;
  ${({ theme }) => theme.messageInput.container.css};
`;

const EditingBoxContainer = styled.View`
  padding-left: 0;
  padding-right: 0;
  shadow-color: grey;
  shadow-opacity: 0.5;
  z-index: 100;
  background-color: white;
  ${({ theme }) => theme.messageInput.editingBoxContainer.css};
`;

const EditingBoxHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  ${({ theme }) => theme.messageInput.editingBoxHeader.css};
`;

const EditingBoxHeaderTitle = styled.Text`
  font-weight: bold;
  ${({ theme }) => theme.messageInput.editingBoxHeaderTitle.css};
`;

const InputBoxContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding-left: 10px;
  padding-right: 10px;
  min-height: 46;
  margin: 10px;
  align-items: center;
  ${({ theme }) => theme.messageInput.inputBoxContainer.css};
`;

const InputBox = styled.TextInput`
  flex: 1;
  margin: -5px;
  max-height: 60px;
  ${({ theme }) => theme.messageInput.inputBox.css};
`;

const SendButtonContainer = styled.TouchableOpacity`
  margin-left: 8;
  ${({ theme }) => theme.messageInput.sendButton.css};
`;

const SendButtonIcon = styled.Image`
  width: 15;
  height: 15;
  ${({ theme }) => theme.messageInput.sendButtonIcon.css};
`;

const IconSquareContainer = styled.TouchableOpacity`
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  padding: 5px;
  ${({ theme }) => theme.iconSquare.container.css};
`;

class MessageInput extends PureComponent {
  static themePath = 'messageInput';

  static propTypes = {
    initialValue: PropTypes.string,
    onChangeText: PropTypes.func,
    dismissKeyboard: PropTypes.func,
    members: PropTypes.object,
    watchers: PropTypes.object,
    editing: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    clearEditingState: PropTypes.func,
    client: PropTypes.object,
    sendMessage: PropTypes.func,
    channel: PropTypes.object,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);
    const state = this.getMessageDetailsForState(
      props.editing,
      props.initialValue
    );
    this.state = {
      ...state,
    };
    this.sending = false;
  }

  componentDidMount() {
    if (this.props.editing) this.inputBox.focus();
  }

  componentDidUpdate(prevProps) {
    if (this.props.editing) this.inputBox.focus();
    if (
      this.props.editing &&
      prevProps.editing &&
      this.props.editing.id === prevProps.editing.id
    ) {
      return;
    }

    if (this.props.editing && !prevProps.editing) {
      this.setState(
        this.getMessageDetailsForState(
          this.props.editing,
          this.props.initialValue
        )
      );
    }

    if (
      this.props.editing &&
      prevProps.editing &&
      this.props.editing.id !== prevProps.editing.id
    ) {
      this.setState(
        this.getMessageDetailsForState(
          this.props.editing,
          this.props.initialValue
        )
      );
    }

    if (!this.props.editing && prevProps.editing) {
      this.setState(
        this.getMessageDetailsForState(null, this.props.initialValue)
      );
    }
  }

  getMessageDetailsForState = (message, initialValue) => {
    let text = initialValue || '';

    if (message) {
      text = message.text;
    }
    return {
      text,
    };
  };

  getMembers = () => {
    const result = [];
    const members = this.props.members;
    if (members && Object.values(members).length) {
      Object.values(members).forEach((member) => result.push(member.user));
    }

    return result;
  };

  getWatchers = () => {
    const result = [];
    const watchers = this.props.watchers;
    if (watchers && Object.values(watchers).length) {
      result.push(...Object.values(watchers));
    }

    return result;
  };

  getUsers = () => {
    const users = [...this.getMembers(), ...this.getWatchers()];

    // make sure we don't list users twice
    const uniqueUsers = {};
    for (const user of users) {
      if (user !== undefined && !uniqueUsers[user.id]) {
        uniqueUsers[user.id] = user;
      }
    }
    const usersArray = Object.values(uniqueUsers);

    return usersArray;
  };

  /** Checks if the message is valid or not. Accordingly we can enable/disable send button */
  isValidMessage = () => {
    if (this.state.text && this.state.text !== '') return true;
    return false;
  };

  sendMessage = async () => {
    if (this.sending) return;
    this.sending = true;

    const { text } = this.state;
    await this.setState({ text: '' }, () => this.inputBox.clear());

    // Disallow sending message if its empty.
    if (!text) {
      return (this.sending = false);
    }

    if (this.props.editing) {
      const updatedMessage = { ...this.props.editing };

      updatedMessage.text = text;
      // TODO: Remove this line and show an error when submit fails
      this.props.clearEditingState();

      const updateMessagePromise = this.props
        .editMessage(updatedMessage)
        .then(this.props.clearEditingState);
      logChatPromiseExecution(updateMessagePromise, 'update message');

      this.sending = false;
    } else {
      try {
        this.props.sendMessage({
          text,
        });

        this.sending = false;
        this.setState((prevState) => ({
          text: '',
        }));
      } catch (err) {
        this.sending = false;
        this.setState({ text });
        console.log('Failed');
      }
    }
  };

  updateMessage = async () => {
    try {
      await this.props.client.editMessage({
        ...this.props.editing,
        text: this.state.text,
      });

      this.setState({ text: '' });
      this.props.clearEditingState();
    } catch (err) {
      console.log(err);
    }
  };

  onChangeText = (text) => {
    if (this.sending) return;
    this.setState({ text });

    if (text) {
      logChatPromiseExecution(
        this.props.channel.keystroke(),
        'start typing event'
      );
    }

    this.props.onChangeText && this.props.onChangeText(text);
  };

  appendText = (text) => {
    this.setState({
      text: this.state.text + text,
    });
  };

  setInputBoxRef = (o) => (this.inputBox = o);

  renderInputContainer = () => {
    const { disabled, Input, t } = this.props;

    let additionalTextInputProps = {};

    if (disabled) {
      additionalTextInputProps = {
        editable: false,
      };
    }

    return (
      <Container>
        <InputBoxContainer>
          <InputBox
            multiline
            onChangeText={this.onChangeText}
            placeholder={t('Write your message')}
            ref={this.setInputBoxRef}
            value={this.state.text}
            {...additionalTextInputProps}
          />
          <SendButtonContainer
            title={t('Send message')}
            onPress={this.sendMessage}
            disabled={disabled || this.sending || !this.isValidMessage()}
          >
            {this.props.editing ? (
              <SendButtonIcon source={iconEdit} />
            ) : (
              <SendButtonIcon source={iconSendNewMessage} />
            )}
          </SendButtonContainer>
        </InputBoxContainer>
      </Container>
    );
  };

  render() {
    const { t } = this.props;

    if (this.props.editing) {
      return (
        <React.Fragment>
          <EditingBoxContainer>
            <EditingBoxHeader>
              <EditingBoxHeaderTitle>
                {t('Editing Message')}
              </EditingBoxHeaderTitle>
              <IconSquareContainer
                onPress={() => this.props.clearEditingState()}
              >
                <Image source={iconClose} style={{ height: 15, width: 15 }} />
              </IconSquareContainer>
            </EditingBoxHeader>
            {this.renderInputContainer()}
          </EditingBoxContainer>
        </React.Fragment>
      );
    }

    return this.renderInputContainer();
  }
}

export default withTranslationContext(
  withKeyboardContext(withChannelContext(themed(MessageInput)))
);
