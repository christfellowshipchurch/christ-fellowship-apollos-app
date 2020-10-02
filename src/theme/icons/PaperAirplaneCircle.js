import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 24a12 12 0 1 0 0-24 12 12 0 0 0 0 24zM4.7 11.7L16 5.2c1-.6 2.1.2 2 1.3l-1.6 10.6c-.1.4-.3.7-.7 1l-.6.1a1 1 0 0 1-.5 0l-3-1.3-1.3 1.6c-.7 1-2.3.5-2.3-.8v-2.3L4.8 14c-1-.4-1-1.8-.1-2.4zM9.3 16v1.8l1-1.4-1-.4zm1.5-.7l4.3 1.7 1.6-10.6L5.3 13l3 1.2L14 9c.4-.4 1 .1.7.5l-3.9 5.6z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
