import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...otherProps}
  >
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      stroke={fill}
      d="M15.9996 15.2877L15.2925 15.9948L21.2958 21.9981L22.0029 21.291L15.9996 15.2877Z"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
