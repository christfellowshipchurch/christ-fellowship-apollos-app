import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { withTheme, Touchable } from '@apollosproject/ui-kit';
import AwesomeAlert from 'react-native-awesome-alerts';

import {
  Row,
  DateLabel,
  CloseIcon,
  Title,
  Subtitle,
  Content,
  Render,
} from './styles';

const NotificationDetails = ({ title, subtitle, body, date, onPressClose }) => (
  <View>
    <Row>
      <DateLabel date={date} />
      <Touchable onPress={onPressClose}>
        <CloseIcon />
      </Touchable>
    </Row>
    <Render condition={title && title !== ''}>
      <Title>{title}</Title>
    </Render>
    <Render condition={subtitle && subtitle !== ''}>
      <Subtitle>{subtitle}</Subtitle>
    </Render>
    <Render condition={body && body !== ''}>
      <Content>{body}</Content>
    </Render>
  </View>
);

NotificationDetails.propTypes = {
  onPressClose: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  body: PropTypes.string,
  date: PropTypes.string,
};

export default withTheme(({ theme, onPressClose, notification }) => ({
  titleStyle: {
    color: theme.colors.success,
    fontSize: theme.helpers.rem(1.5),
    lineHeight: theme.helpers.verticalRhythm(1.5, 1.15),
    fontFamily: theme.typography.sans.black.default,
    fontWeight: '900',
    textAlign: 'center',
  },
  messageStyle: {
    color: theme.colors.text.secondary,
    fontWeight: '700',
  },
  contentContainerStyle: {
    backgroundColor: theme.colors.background.screen,
  },
  customView: (
    <NotificationDetails onPressClose={onPressClose} {...notification} />
  ),
}))(AwesomeAlert);
