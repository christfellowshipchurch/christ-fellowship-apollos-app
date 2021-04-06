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
    xmlns="http://www.w3.org/2000/svg"
    data-reactroot=""
    {...otherProps}
  >
    <Path
      fill="none"
      d="M13.58 5.22C13.85 4.88 14 4.46 14 4C14 2.9 13.1 2 12 2C10.9 2 10 2.9 10 4C10 4.46 10.15 4.88 10.42 5.22"
      undefined="2.5"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      d="M13.58 5.22C13.85 4.88 14 4.46 14 4C14 2.9 13.1 2 12 2C10.9 2 10 2.9 10 4C10 4.46 10.15 4.88 10.42 5.22"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      d="M14.45 19H9.55C9.52 19.16 9.5 19.33 9.5 19.5C9.5 20.88 10.62 22 12 22C13.38 22 14.5 20.88 14.5 19.5C14.5 19.33 14.48 19.16 14.45 19Z"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      d="M5.64 14.89L4 19H20L18.36 14.89C18.12 14.3 18 13.67 18 13.04V11.25C18 7.97 15.47 5.1 12.18 5C8.79 4.9 6 7.62 6 11V13.04C6 13.67 5.88 14.3 5.64 14.89Z"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      d="M3 3L21 21"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
