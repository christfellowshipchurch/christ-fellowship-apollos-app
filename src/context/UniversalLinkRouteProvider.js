/**
 * UniversalLinkRouteProvider.js
 *
 * Author: Caleb Panza
 * Created: Apr 02, 2021
 *
 * Adds a listener for when the app is opened with a Universal Link provided and will route the user accordingly.
 */

import { useState, useEffect, Children } from 'react';
import { Linking, AppState } from 'react-native';

import { useLinkRouter } from 'hooks';

const UniversalLinkRouteProvider = ({ children }) => {
  const [initialised, setInitialised] = useState(false);
  const { routeLink } = useLinkRouter();

  const handleAppStateChange = async () => {
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

UniversalLinkRouteProvider.propTypes = {};
UniversalLinkRouteProvider.defaultProps = {};

export default UniversalLinkRouteProvider;
