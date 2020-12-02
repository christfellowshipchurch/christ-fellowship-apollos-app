import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M20.8604 17.9844C21.1543 17.9424 21.4062 17.6484 21.4062 17.3125V1.85938C21.4062 1.52344 21.0703 1.1875 20.7344 1.1875H5.95312C4.06348 1.1875 2.59375 2.69922 2.59375 4.54688V19.3281C2.59375 21.2178 4.06348 22.6875 5.95312 22.6875H20.7344C21.0703 22.6875 21.4062 22.3936 21.4062 22.0156V21.3438C21.4062 21.0498 21.1543 20.7559 20.8604 20.7139C20.6504 20.168 20.6504 18.5303 20.8604 17.9844ZM19.1387 17.9844C19.0127 18.7402 19.0127 19.958 19.1387 20.6719H5.95312C5.19727 20.6719 4.60938 20.084 4.60938 19.3281C4.60938 18.6143 5.19727 17.9844 5.95312 17.9844H19.1387ZM19.3906 3.20312V15.9688H5.95312C5.44922 15.9688 4.9873 16.0947 4.60938 16.2627V4.54688C4.60938 3.83301 5.19727 3.20312 5.95312 3.20312H19.3906Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
