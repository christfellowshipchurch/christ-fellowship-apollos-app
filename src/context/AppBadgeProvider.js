/**
 * AppBadgeProvider.js
 *
 * Author: Caleb Panza
 * Created: Jul 02, 2021
 *
 * Allows the ability to get and set the Badge that appears on the iOS App Icon.
 */

import React, { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { isOwnUser } from 'stream-chat';
import { useStreamChat } from '../stream-chat/context';

// apn badge context to access badge number
export const AppBadgeContext = React.createContext({
  badge: 0,
  setBadge: () => {},
});
export const useAppBadge = () => React.useContext(AppBadgeContext);

export const AppBadgeProvider = (props) => {
  const { chatClient } = useStreamChat();
  const [badge, _setBadge] = useState(0);
  const badgeRef = useRef(badge);

  const setBadge = (val) => {
    badgeRef.current = val;
    PushNotificationIOS.setApplicationIconBadgeNumber(val);
    _setBadge(val);
  };

  const handleBadge = (state) => {
    if (state === 'active') {
      PushNotificationIOS.getApplicationIconBadgeNumber((num) => {
        setBadge(num);
      });
    }
  };

  useEffect(() => {
    PushNotificationIOS.getApplicationIconBadgeNumber((num) => {
      setBadge(num);
    });
    AppState.addEventListener('change', handleBadge);
    return () => {
      AppState.removeEventListener('change', handleBadge);
    };
  }, []);

  useEffect(
    () => {
      if (badgeRef) {
        const user = chatClient?.user;
        setBadge(isOwnUser(user) ? user.total_unread_count : 0);

        const listener = chatClient?.on((e) => {
          if (Number.isInteger(e.total_unread_count)) {
            setBadge(e.total_unread_count);
          }
        });

        return () => {
          if (listener) {
            listener.unsubscribe();
          }
        };
      }
    },
    [chatClient, badgeRef]
  );

  return (
    <AppBadgeContext.Provider
      value={{
        badge: badgeRef.current,
        setBadge,
      }}
    >
      {props.children}
    </AppBadgeContext.Provider>
  );
};
