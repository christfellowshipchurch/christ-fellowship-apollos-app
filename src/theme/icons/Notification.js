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
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      d="M10 18H14C14.31 18.41 14.5 18.94 14.5 19.5C14.5 20.88 13.38 22 12 22C10.62 22 9.5 20.88 9.5 19.5C9.5 18.94 9.69 18.41 10 18Z"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      stroke-width="2.5"
      stroke={fill}
      fill="none"
      d="M10.414 5.21245C10.9193 5.07396 11.4512 5 12 5C12.5488 5 13.0807 5.07396 13.586 5.21245C13.8522 4.87379 14 4.4566 14 4C14 2.9 13.1 2 12 2C10.9 2 10 2.9 10 4C10 4.4566 10.1478 4.87379 10.414 5.21245Z"
    />
    <Path
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      d="M6 14L4 18H20L18 14V11C18 7.69 15.31 5 12 5C8.69 5 6 7.69 6 11V14Z"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
