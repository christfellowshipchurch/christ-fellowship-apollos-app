import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard } from 'react-native';
import styled from '@stream-io/styled-components';

import { KeyboardContext } from '../context';
import { useKeyboardCompatibleHeight } from './hooks/useKeyboardCompatibleHeight';

const KeyboardCompatibleContainer = styled.View`
  height: 100%;
`;

export const KeyboardCompatibleView = ({
  children,
  enabled = true,
  keyboardDismissAnimationDuration = 250,
  keyboardOpenAnimationDuration = 250,
  isBannerOpen = false,
  bannerHeight = 0,
}) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rootChannelView = useRef();

  const [initialHeight, setInitialHeight] = useState(0);

  const { height: channelHeight, isKeyboardOpen } = useKeyboardCompatibleHeight(
    {
      enabled,
      initialHeight,
      rootChannelView,
    }
  );

  useEffect(
    () => {
      Animated.timing(heightAnim, {
        duration: isKeyboardOpen
          ? keyboardDismissAnimationDuration
          : keyboardOpenAnimationDuration,
        toValue: channelHeight,
        useNativeDriver: false,
      }).start();
    },
    [
      channelHeight,
      heightAnim,
      keyboardDismissAnimationDuration,
      keyboardOpenAnimationDuration,
    ]
  );

  const dismissKeyboard = useCallback(
    () => {
      Keyboard.dismiss();

      return new Promise((resolve) => {
        if (!isKeyboardOpen) {
          // If channel height is already at full length, then don't do anything.
          resolve();
        } else {
          // Bring the channel height to its full length state.
          Animated.timing(heightAnim, {
            duration: keyboardDismissAnimationDuration,
            toValue: initialHeight,
            useNativeDriver: false,
          }).start(resolve);
        }
      });
    },
    [
      channelHeight,
      heightAnim,
      initialHeight,
      isKeyboardOpen,
      keyboardDismissAnimationDuration,
    ]
  );

  useEffect(
    () => {
      if (isBannerOpen) {
        setInitialHeight(initialHeight - bannerHeight);
        Animated.timing(heightAnim, {
          duration: 10,
          toValue: initialHeight - bannerHeight,
          useNativeDriver: false,
        }).start();
      }
    },
    [isBannerOpen]
  );

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      if (!enabled) {
        return;
      }

      // Not to set initial height again.
      if (!initialHeight) {
        setInitialHeight(isBannerOpen ? height - bannerHeight : height);
        Animated.timing(heightAnim, {
          duration: 10,
          toValue: isBannerOpen ? height - bannerHeight : height,
          useNativeDriver: false,
        }).start();
      }
    },
    [enabled, heightAnim, initialHeight]
  );

  if (!enabled) {
    return (
      <KeyboardContext.Provider
        value={{
          dismissKeyboard,
        }}
      >
        {children}
      </KeyboardContext.Provider>
    );
  }

  return (
    <Animated.View
      onLayout={onLayout}
      style={{
        height: initialHeight ? heightAnim : undefined,
      }}
    >
      <KeyboardContext.Provider value={{ dismissKeyboard }}>
        <KeyboardCompatibleContainer ref={rootChannelView}>
          {children}
        </KeyboardCompatibleContainer>
      </KeyboardContext.Provider>
    </Animated.View>
  );
};

export default {};
