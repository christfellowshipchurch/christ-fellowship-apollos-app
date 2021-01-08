import React from 'react';
import DeviceInfo from 'react-native-device-info';

import ScreenOrientation, {
  PORTRAIT,
  UNLOCK,
} from 'react-native-orientation-locker/ScreenOrientation';
import { usePlayerControls } from '@apollosproject/ui-media-player';

const ScreenOrientationHandler = () => {
  const { pictureMode } = usePlayerControls();

  if (DeviceInfo.isTablet() || pictureMode === 1) {
    return <ScreenOrientation orientation={UNLOCK} />;
  }

  return <ScreenOrientation orientation={PORTRAIT} />;
};

ScreenOrientationHandler.propTypes = {};

ScreenOrientationHandler.defaultProps = {};

export default ScreenOrientationHandler;
