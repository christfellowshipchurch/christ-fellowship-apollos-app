import React, { useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Streami18n } from 'stream-chat-react-native';
import { ChatContext, TranslationContext } from '../context';
import { themed } from '../styles/theme';
import { useIsOnline } from './hooks/useIsOnline';
import { useStreami18n } from './hooks/useStreami18n';

const Chat = (props) => {
  const { children, client, i18nInstance = () => {} } = props;

  const [channel, setChannel] = useState();
  const [connectionRecovering, setConnectionRecovering] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [translators, setTranslators] = useState({
    t: (key) => key,
    tDateTimeParser: (input) => moment(input),
  });

  // Setup translators
  useStreami18n({ i18nInstance, setTranslators });

  // Setup connection event listeners
  useIsOnline({
    client,
    setConnectionRecovering,
    setIsOnline,
  });

  const setActiveChannel = (channel) => setChannel(channel);

  if (!translators.t) return null;

  const chatContext = {
    channel,
    client,
    connectionRecovering,
    isOnline,
    setActiveChannel,
  };

  return (
    <ChatContext.Provider value={chatContext}>
      <TranslationContext.Provider value={translators}>
        {children}
      </TranslationContext.Provider>
    </ChatContext.Provider>
  );
};

Chat.propTypes = {
  client: PropTypes.object.isRequired,
  style: PropTypes.object,
  i18nInstance: PropTypes.instanceOf(Streami18n),
};

Chat.themePath = '';

export default themed(Chat);
