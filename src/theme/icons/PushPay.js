import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.199951 12C0.199951 5.484 5.48395 0.199997 12 0.199997C18.516 0.199997 23.8 5.484 23.8 12C23.8 18.516 18.516 23.8 12 23.8C5.48395 23.8 0.199951 18.516 0.199951 12ZM11.8519 6.48H14.7199C17.5159 6.48 18.7559 8.106 18.7579 10.014C18.7579 12.628 16.7679 14.078 14.3879 14.078H12.2519L11.6099 17.51H9.71793L11.8519 6.48ZM12.5759 12.392H14.2359C15.6659 12.392 16.8639 11.602 16.8619 10.076C16.8619 8.782 15.9319 8.182 14.8019 8.182H13.3999L12.5759 12.392ZM9.8399 6.48L7.70589 17.512H8.5999L10.7279 6.48H9.8399ZM5.68994 17.512L7.82594 6.48H8.71194L6.58394 17.512H5.68994Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
