import React, { useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import PropTypes from 'prop-types';

import ScreenOrientation, {
  PORTRAIT,
  UNLOCK,
} from 'react-native-orientation-locker/ScreenOrientation';

const baseOrientation = (type) => {
  switch (type) {
    case 'media-player':
      return UNLOCK;
    default:
      return PORTRAIT;
  }
};

const ScreenOrientationHandler = ({ type }) => {
  const [orientation, setOrientation] = useState(baseOrientation(type));

  if (DeviceInfo.isTablet()) {
    return <ScreenOrientation orientation={UNLOCK} />;
  }

  return (
    <ScreenOrientation
      orientation={orientation}
      onChange={(newOrientation) => {
        /**
         * There's a weird UI bug that's happening when following these steps
         * if the Orientation is perminantly set to `PORTRAIT` on Content Single:
         *
         * 1. Open Content Single
         * 2. Play a video
         * 3. Rotate to Landscape
         * 4. Minimize and close the video
         * 5. Content Single auto rotates back to Portrait, but sometimes the
         *    content gets distorted and messed up
         *
         * The solution:
         * An orientation change is only triggered by the Media Player, so if the
         * orientation changes, that means the Media Player is open and we want to
         * unlock the orientation of the Content Single until the user manually resets
         * the orientation to PORTAIT, in which case we will then lock it back to PORTRAIT
         * mode without any risk of strange resizing as mentioned above.
         */

        if (newOrientation !== PORTRAIT && orientation === PORTRAIT) {
          setOrientation(UNLOCK);
        } else if (orientation !== PORTRAIT) {
          setOrientation(PORTRAIT);
        }
      }}
    />
  );
};

ScreenOrientationHandler.propTypes = {
  type: PropTypes.oneOf(['default', 'media-player']),
};

ScreenOrientationHandler.defaultProps = {
  type: 'default',
};

export default ScreenOrientationHandler;
