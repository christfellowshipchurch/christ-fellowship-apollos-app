import React from 'react';
import styled from '@stream-io/styled-components';
import PropTypes from 'prop-types';
import { Avatar } from '../../Avatar';

const Container = styled.View`
  margin-right: ${({ alignment }) => (alignment === 'left' ? 8 : 0)};
  margin-left: ${({ alignment }) => (alignment === 'right' ? 8 : 0)};
  ${({ theme }) => theme.message.avatarWrapper.container.css};
`;

const Spacer = styled.View`
  width: 32;
  height: 28;
  ${({ theme }) => theme.message.avatarWrapper.spacer.css};
`;

const MessageAvatar = ({
  message,
  alignment,
  groupStyles,
  showAvatar = null,
}) => {
  let visible = showAvatar;

  if (visible === null) {
    visible = !!(groupStyles[0] === 'single' || groupStyles[0] === 'bottom');
  }

  return (
    <Container alignment={alignment}>
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
};

MessageAvatar.propTypes = {
  message: PropTypes.object,
  isMyMessage: PropTypes.func,
  groupStyles: PropTypes.array,
};

export default MessageAvatar;
