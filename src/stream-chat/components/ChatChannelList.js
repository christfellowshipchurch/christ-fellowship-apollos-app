/**
 * ChatChannelList.js
 *
 * Author: Caleb Panza
 * Created: Apr 01, 2021
 *
 * Displays a list of Chat Channels that a user is a member of.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import { BackgroundView, withTheme } from '@apollosproject/ui-kit';
import { Chat, ChannelList } from 'stream-chat-react-native';
import { useStreamChat } from '../context';
import { mapThemeValues } from '../utils';

// :: query for group or message types
const baseFilters = {
  $or: [
    {
      type: 'group',
    },
    {
      type: 'messaging',
    },
  ],
};

// :: sort first by read/unread, then by latest message date
const sort = [{ has_unread: -1 }, { last_message_at: -1 }];
const options = {
  presence: true,
  state: true,
  watch: true,
};

const ChatChannelList = ({ theme }) => {
  // return null;

  const navigation = useNavigation();
  const { chatClient, setChannel } = useStreamChat();
  const chatClientUserId = chatClient?.user?.id;

  const filters = useMemo(
    () => ({
      ...baseFilters,
      members: {
        $in: [chatClientUserId || ''],
      },
    }),
    [chatClientUserId]
  );
  const chatTheme = mapThemeValues(theme);

  return (
    <BackgroundView>
      <Chat client={chatClient} style={chatTheme}>
        <ChannelList
          additionalFlatListProps={{
            keyboardDismissMode: 'on-drag',
            getItemLayout: (_, index) => ({
              index,
              length: 65,
              offset: 65 * index,
            }),
          }}
          filters={filters}
          HeaderNetworkDownIndicator={() => null}
          maxUnreadCount={99}
          onSelect={(channel) => {
            setChannel({ channel });
            navigation.navigate('ChatChannelSingle', {
              hideNavigationHeader: true,
            });
          }}
          options={options}
          sort={sort}
        />
      </Chat>
    </BackgroundView>
  );
};

ChatChannelList.propTypes = {
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({
      primary: PropTypes.string,
      alert: PropTypes.string,
      success: PropTypes.string,
      text: PropTypes.shape({
        primary: PropTypes.string,
        secondary: PropTypes.string,
        tertiary: PropTypes.string,
      }),
      background: PropTypes.shape({
        screen: PropTypes.string,
        paper: PropTypes.string,
      }),
    }),
  }),
};
ChatChannelList.defaultProps = {};

export default withTheme()(ChatChannelList);
