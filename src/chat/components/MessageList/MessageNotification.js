import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import styled from '@stream-io/styled-components';

import { themed } from '../../styles/theme';
import { withTranslationContext } from '../../context';

const Container = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 27px;
  width: 112px;
  z-index: 10;
  margin-bottom: 0;
  border-radius: 13px;
  background-color: ${({ theme }) => theme.colors.primary};
  transform: translateY(9px);
  ${({ theme }) => theme.messageList.messageNotification.container.css};
`;

const MessageNotificationText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 600;
  ${({ theme }) => theme.messageList.messageNotification.text.css};
`;

class MessageNotification extends PureComponent {
  static themePath = 'messageList.messageNotification';

  static propTypes = {
    showNotification: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    showNotification: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      notificationOpacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.notificationOpacity, {
      toValue: this.props.showNotification ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showNotification !== this.props.showNotification) {
      Animated.timing(this.state.notificationOpacity, {
        toValue: this.props.showNotification ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const { t } = this.props;

    if (!this.props.showNotification) {
      return null;
    }
    return (
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          opacity: this.state.notificationOpacity,
        }}
      >
        <Container onPress={this.props.onPress}>
          <MessageNotificationText>{t('New Messages')}</MessageNotificationText>
        </Container>
      </Animated.View>
    );
  }
}

export default withTranslationContext(themed(MessageNotification));
