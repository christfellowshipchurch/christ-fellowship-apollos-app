import React, { useContext, useEffect, useState } from 'react';
import truncate from 'lodash/truncate';
import styled from '@stream-io/styled-components';
import PropTypes from 'prop-types';

import Avatar from '../Avatar';
import { themed } from '../../styles/theme';
import { ChatContext } from '../../context';
import { useChannelPreviewDisplayName } from '../hooks/useChannelPreviewDisplayName';
import { useChannelPreviewDisplayAvatar } from '../hooks/useChannelPreviewDisplayAvatar';
import { useLatestMessagePreview } from '../hooks/useLatestMessagePreview';

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-bottom-color: #ebebeb;
  border-bottom-width: 1px;
  padding: 10px;
  ${({ theme }) => theme.channelPreview.container.css};
`;

const Details = styled.View`
  flex-direction: column;
  flex: 1;
  padding-left: 10px;
  ${({ theme }) => theme.channelPreview.details.css};
`;

const DetailsTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  ${({ theme }) => theme.channelPreview.detailsTop.css};
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 14px;
  flex: 1;
  ${({ theme }) => theme.channelPreview.title.css};
`;

const Date = styled.Text`
  color: #767676;
  font-size: 11px;
  text-align: right;
  ${({ theme }) => theme.channelPreview.date.css};
`;

const Message = styled.Text`
  color: ${({ theme, unread }) =>
    unread
      ? theme.channelPreview.message.unreadColor
      : theme.channelPreview.message.color};
  font-size: 13px;
  font-weight: ${({ theme, unread }) =>
    unread
      ? theme.channelPreview.message.unreadFontWeight
      : theme.channelPreview.message.fontWeight};
  ${({ theme }) => theme.channelPreview.message.css};
`;

const ChannelPreview = ({ channel, setActiveChannel }) => {
  const { client } = useContext(ChatContext);
  const [lastMessage, setLastMessage] = useState({});
  const [unread, setUnread] = useState(channel.countUnread());
  const latestMessage = useLatestMessagePreview(channel, lastMessage);

  useEffect(() => {
    const handleEvent = (e) => {
      setLastMessage(e.message);

      if (e.type === 'message.new') {
        setUnread(channel.countUnread());
      }
    };

    channel.on('message.new', handleEvent);
    channel.on('message.updated', handleEvent);
    channel.on('message.deleted', handleEvent);

    return () => {
      channel.off('message.new', handleEvent);
      channel.off('message.updated', handleEvent);
      channel.off('message.deleted', handleEvent);
    };
  }, []);

  useEffect(() => {
    const handleReadEvent = (e) => {
      if (e.user.id === client.userID) {
        setUnread(0);
      }
    };

    channel.on('message.read', handleReadEvent);

    return () => {
      channel.off('message.read', handleReadEvent);
    };
  }, []);

  const displayAvatar = useChannelPreviewDisplayAvatar(channel);
  const displayName = useChannelPreviewDisplayName(channel);
  return (
    <Container
      onPress={setActiveChannel && setActiveChannel.bind(null, channel)}
      testID="channel-preview-button"
    >
      <Avatar image={displayAvatar.image} name={displayAvatar.name} size={40} />
      <Details>
        <DetailsTop>
          <Title ellipsizeMode="tail" numberOfLines={1}>
            {displayName}
          </Title>
          <Date>{latestMessage.created_at}</Date>
        </DetailsTop>
        <Message unread={unread > 0 ? unread : undefined}>
          {latestMessage &&
            latestMessage.text &&
            truncate(latestMessage.text.replace(/\n/g, ' '), {
              length: 30,
            })}
        </Message>
      </Details>
    </Container>
  );
};

ChannelPreview.propTypes = {
  channel: PropTypes.object.isRequired,
  setActiveChannel: PropTypes.func,
};

ChannelPreview.themePath = 'channelPreview';

export default React.memo(themed(ChannelPreview));
