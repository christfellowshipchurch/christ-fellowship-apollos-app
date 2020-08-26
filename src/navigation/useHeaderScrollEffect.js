import { useState, useEffect } from 'react';
import { Animated } from 'react-native';

// eslint-disable-next-line import/prefer-default-export
export default ({ navigation }) => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const setNavigationParam = (params) => {
    navigation.setParams(params);
  };

  useEffect(() => setNavigationParam({ scrollY }), []);

  return {
    scrollY,
  };
};
