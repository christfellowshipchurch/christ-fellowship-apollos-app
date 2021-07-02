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

// apn badge context to access badge number
export const AppBadgeContext = React.createContext({
  badge: 0,
  setBadge: () => {},
});
export const useAppBadge = () => React.useContext(AppBadgeContext);

export const AppBadgeProvider = (props) => {
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
