import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M19.3906 10.5938H13.3438V4.54688C13.3438 4.21094 13.0078 3.875 12.6719 3.875H11.3281C10.9502 3.875 10.6562 4.21094 10.6562 4.54688V10.5938H4.60938C4.23145 10.5938 3.9375 10.9297 3.9375 11.2656V12.6094C3.9375 12.9873 4.23145 13.2812 4.60938 13.2812H10.6562V19.3281C10.6562 19.7061 10.9502 20 11.3281 20H12.6719C13.0078 20 13.3438 19.7061 13.3438 19.3281V13.2812H19.3906C19.7266 13.2812 20.0625 12.9873 20.0625 12.6094V11.2656C20.0625 10.9297 19.7266 10.5938 19.3906 10.5938Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
