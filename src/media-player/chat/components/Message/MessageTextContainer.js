import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import styled, { withTheme } from '@stream-io/styled-components';

import { capitalize } from '../../utils';

const TextContainer = styled.View`
  border-bottom-left-radius: ${({ theme, groupStyle }) =>
    groupStyle.indexOf('left') !== -1
      ? theme.message.content.textContainer.borderRadiusS
      : theme.message.content.textContainer.borderRadiusL};
  border-bottom-right-radius: ${({ theme, groupStyle }) =>
    groupStyle.indexOf('right') !== -1
      ? theme.message.content.textContainer.borderRadiusS
      : theme.message.content.textContainer.borderRadiusL};
  border-top-left-radius: ${({ theme, groupStyle }) =>
    groupStyle === 'leftBottom' || groupStyle === 'leftMiddle'
      ? theme.message.content.textContainer.borderRadiusS
      : theme.message.content.textContainer.borderRadiusL};
  border-top-right-radius: ${({ theme, groupStyle }) =>
    groupStyle === 'rightBottom' || groupStyle === 'rightMiddle'
      ? theme.message.content.textContainer.borderRadiusS
      : theme.message.content.textContainer.borderRadiusL};
  padding: 5px;
  padding-left: 8;
  margin-top: 2;
  padding-right: 8;
  align-self: ${({ alignment }) =>
    alignment === 'left' ? 'flex-start' : 'flex-end'};
  border-width: ${({ theme, alignment }) =>
    alignment === 'left'
      ? theme.message.content.textContainer.leftBorderWidth
      : theme.message.content.textContainer.rightBorderWidth};
  border-color: ${({ theme, alignment }) =>
    alignment === 'left'
      ? theme.message.content.textContainer.leftBorderColor
      : theme.message.content.textContainer.rightBorderColor};
  background-color: ${({ theme, alignment, type, status }) =>
    alignment === 'left' || type === 'error' || status === 'failed'
      ? theme.colors.transparent
      : theme.colors.light};
  ${({ theme }) => theme.message.content.textContainer.css};
`;

const MessageTextContainer = withTheme((props) => {
  const { message, groupStyles = ['bottom'], alignment } = props;

  const groupStyle = alignment + capitalize(groupStyles[0]);

  if (!message.text) return false;
  const styles = props.theme ? props.theme.message.content.text : {};
  return (
    <React.Fragment>
      <TextContainer
        alignment={alignment}
        groupStyle={groupStyle}
        status={message.status}
        type={message.type}
      >
        <Text style={styles}>{message.text}</Text>
      </TextContainer>
    </React.Fragment>
  );
});

MessageTextContainer.propTypes = {
  message: PropTypes.object,
  groupStyles: PropTypes.array,
  theme: PropTypes.object,
};

export default MessageTextContainer;
