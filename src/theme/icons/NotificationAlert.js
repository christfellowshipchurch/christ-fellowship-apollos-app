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
      fill="none"
      d="M12.58 5.22C12.85 4.88 13 4.46 13 4C13 2.9 12.1 2 11 2C9.9 2 9 2.9 9 4C9 4.46 9.15 4.88 9.42 5.22"
      strokeWidth="2.5"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      d="M12.58 5.22C12.85 4.88 13 4.46 13 4C13 2.9 12.1 2 11 2C9.9 2 9 2.9 9 4C9 4.46 9.15 4.88 9.42 5.22"
    />
    <Path
      fill="none"
      d="M11.41 19H8.55C8.52 19.16 8.5 19.33 8.5 19.5C8.5 20.88 9.62 22 11 22C11.82 22 12.54 21.61 13 21C12.31 20.48 11.76 19.79 11.41 19H8.55H11.41Z"
      strokeWidth="2.5"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      d="M11.41 19H8.55C8.52 19.16 8.5 19.33 8.5 19.5C8.5 20.88 9.62 22 11 22C11.82 22 12.54 21.61 13 21C12.31 20.48 11.76 19.79 11.41 19ZM11.41 19H8.55"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      d="M17 12.1C16.68 12.03 16.34 12 16 12C13.24 12 11 14.24 11 17C11 17.71 11.15 18.39 11.41 19H8.55H3L4.64 14.89C4.88 14.3 5 13.67 5 13.04V11C5 7.62 7.79 4.9 11.18 5C14.47 5.1 17 7.97 17 11.25V12.1Z"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      d="M16 22C18.7614 22 21 19.7614 21 17C21 14.2386 18.7614 12 16 12C13.2386 12 11 14.2386 11 17C11 19.7614 13.2386 22 16 22Z"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
