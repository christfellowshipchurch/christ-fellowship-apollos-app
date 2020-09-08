import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, View } from 'react-native';

import { KeyboardContext } from '../context';
import { useKeyboardCompatibleHeight } from './hooks/useKeyboardCompatibleHeight';

export const KeyboardCompatibleView = ({
  children,
  enabled = true,
  keyboardDismissAnimationDuration = 250,
  keyboardOpenAnimationDuration = 250,
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
        setInitialHeight(height);
        Animated.timing(heightAnim, {
          duration: 10,
          toValue: height,
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
        <View collapsable={false} ref={rootChannelView}>
          {children}
        </View>
      </KeyboardContext.Provider>
    </Animated.View>
  );
};

export default {};
