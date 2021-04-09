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
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      d="M17.82 2.29L5.01 15.11L2 22L8.89 18.99L21.71 6.18C22.1 5.79 22.1 5.16 21.71 4.77L19.24 2.3C18.84 1.9 18.21 1.9 17.82 2.29Z"
      clipRule="evenodd"
      fillRule="evenodd"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      d="M5.01 15.11L8.89 18.99L2 22L5.01 15.11Z"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      d="M19.23 8.65999L15.34 4.76999L17.81 2.29999C18.2 1.90999 18.83 1.90999 19.22 2.29999L21.69 4.76999C22.08 5.15999 22.08 5.78999 21.69 6.17999L19.23 8.65999Z"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
