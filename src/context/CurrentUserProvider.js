/**
 * CurrentUserProvider.js
 *
 * Author: Caleb Panza
 * Created: Jun 23, 2021
 *
 * Listens to changes in the Current User data and response accordingly
 */

import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useCurrentUser } from 'hooks';
import { useStreamChat } from '../stream-chat';

const CurrentUserProvider = ({ children }) => {
  const { connectUser, disconnectUser } = useStreamChat();
  const {
    authId,
    firstName,
    lastName,
    photo,
    streamChatToken,
  } = useCurrentUser();

  useEffect(
    () => {
      function connect() {
        if (isEmpty(authId) || isEmpty(streamChatToken)) return;

        connectUser({
          userId: authId.split(':')[1],
          userToken: streamChatToken,
          userName: `${firstName} ${lastName}`,
          userImage: photo?.uri,
        });
      }

      connect();

      return function cleanup() {
        disconnectUser();
      };
    },
    [authId, firstName, lastName, photo, streamChatToken]
  );

  return children;
};

CurrentUserProvider.propTypes = {};
CurrentUserProvider.defaultProps = {};

export default CurrentUserProvider;
