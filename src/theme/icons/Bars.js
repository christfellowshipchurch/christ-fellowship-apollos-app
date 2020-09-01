import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M21.1094 8.07812C21.3672 8.07812 21.625 7.86328 21.625 7.5625V6.1875C21.625 5.92969 21.3672 5.67188 21.1094 5.67188H2.89062C2.58984 5.67188 2.375 5.92969 2.375 6.1875V7.5625C2.375 7.86328 2.58984 8.07812 2.89062 8.07812H21.1094ZM21.1094 14.9531C21.3672 14.9531 21.625 14.7383 21.625 14.4375V13.0625C21.625 12.8047 21.3672 12.5469 21.1094 12.5469H2.89062C2.58984 12.5469 2.375 12.8047 2.375 13.0625V14.4375C2.375 14.7383 2.58984 14.9531 2.89062 14.9531H21.1094ZM21.1094 21.8281C21.3672 21.8281 21.625 21.6133 21.625 21.3125V19.9375C21.625 19.6797 21.3672 19.4219 21.1094 19.4219H2.89062C2.58984 19.4219 2.375 19.6797 2.375 19.9375V21.3125C2.375 21.6133 2.58984 21.8281 2.89062 21.8281H21.1094Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
