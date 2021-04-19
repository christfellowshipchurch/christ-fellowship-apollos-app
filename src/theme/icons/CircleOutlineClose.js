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
    <Circle cx="12" cy="12" r="11.15" stroke={fill} strokeWidth="1.7" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.75738 6.69671C7.46448 6.40382 6.98961 6.40382 6.69672 6.69671C6.40382 6.98961 6.40382 7.46448 6.69672 7.75737L10.9394 12L6.69672 16.2427C6.40383 16.5356 6.40383 17.0105 6.69672 17.3034C6.98962 17.5963 7.46449 17.5963 7.75738 17.3034L12.0001 13.0607L16.2427 17.3033C16.5356 17.5962 17.0104 17.5962 17.3033 17.3033C17.5962 17.0104 17.5962 16.5355 17.3033 16.2427L13.0607 12L17.3033 7.75743C17.5962 7.46454 17.5962 6.98966 17.3033 6.69677C17.0104 6.40388 16.5356 6.40388 16.2427 6.69677L12 10.9394L7.75738 6.69671Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
