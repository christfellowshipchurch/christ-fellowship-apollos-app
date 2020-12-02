import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.83721 0H21.1628C22.7297 0 24 1.27026 24 2.83721V21.1628C24 22.7297 22.7297 24 21.1628 24H2.83721C1.27026 24 0 22.7297 0 21.1628V2.83721C0 1.27026 1.27026 0 2.83721 0ZM18.6623 7.72094C18.6623 6.61257 18.4307 5.73489 17.9144 4.88373L13.4619 5.78791C13.7456 6.38094 13.927 7.10094 13.927 8.16001C13.927 10.093 12.5581 12.9302 11.4512 14.7358L10.2605 5.19303L5.36279 5.65815L7.60465 19.0698H13.1963C15.6451 15.8465 18.6623 11.2558 18.6623 7.72094Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
