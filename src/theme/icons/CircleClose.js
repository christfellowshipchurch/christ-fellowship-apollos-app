import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, Circle } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...otherProps}
    fill="none"
  >
    <Circle cx="12" cy="12" r="12" fill={fill} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.75738 6.69672C7.46449 6.40383 6.98961 6.40383 6.69672 6.69672C6.40383 6.98961 6.40383 7.46449 6.69672 7.75738L10.9394 12.0001L6.69673 16.2427C6.40383 16.5356 6.40383 17.0105 6.69673 17.3034C6.98962 17.5963 7.46449 17.5963 7.75739 17.3034L12.0001 13.0607L16.2427 17.3033C16.5356 17.5962 17.0104 17.5962 17.3033 17.3033C17.5962 17.0104 17.5962 16.5356 17.3033 16.2427L13.0607 12.0001L17.3033 7.75744C17.5962 7.46455 17.5962 6.98967 17.3033 6.69678C17.0104 6.40389 16.5356 6.40389 16.2427 6.69678L12.0001 10.9394L7.75738 6.69672Z"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
