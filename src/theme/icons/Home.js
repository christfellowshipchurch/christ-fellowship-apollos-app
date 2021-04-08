import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      d="M20 8.4L12 2L4 8.4V22H20V8.4Z"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      d="M22 10L12 2L2 10"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      fill={fill}
      d="M14 14H10V22H14V14Z"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
