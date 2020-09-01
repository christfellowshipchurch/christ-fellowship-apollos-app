import { useState, useEffect, Children } from 'react';
import { Linking, AppState } from 'react-native';

import { useLinkRouter } from './hooks';

const AppStateProvider = ({ children }) => {
  const [initialised, setInitialised] = useState(false);
  const { routeLink } = useLinkRouter();

  const handleAppStateChange = async (event) => {
    const initial = await Linking.getInitialURL();

    if (initial !== null && !initialised) {
      setInitialised(true);
      // app was opened by a Universal Link
      routeLink(initial);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    if (Linking.getInitialURL() !== null) {
      AppState.removeEventListener('change', handleAppStateChange);
    }
  }, []);

  return Children.only(children);
};

export default AppStateProvider;
