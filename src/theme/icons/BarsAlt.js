import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M21.9023 6.39453C22.1543 6.39453 22.4062 6.18457 22.4062 5.89062V4.54688C22.4062 4.29492 22.1543 4.04297 21.9023 4.04297H4.09766C3.80371 4.04297 3.59375 4.29492 3.59375 4.54688V5.89062C3.59375 6.18457 3.80371 6.39453 4.09766 6.39453H21.9023ZM21.9023 13.1133C22.1543 13.1133 22.4062 12.9033 22.4062 12.6094V11.2656C22.4062 11.0137 22.1543 10.7617 21.9023 10.7617H2.09766C1.80371 10.7617 1.59375 11.0137 1.59375 11.2656V12.6094C1.59375 12.9033 1.80371 13.1133 2.09766 13.1133H21.9023ZM21.9023 19.832C22.1543 19.832 22.4062 19.6221 22.4062 19.3281V17.9844C22.4062 17.7324 22.1543 17.4805 21.9023 17.4805H9.09766C8.80371 17.4805 8.59375 17.7324 8.59375 17.9844V19.3281C8.59375 19.6221 8.80371 19.832 9.09766 19.832H21.9023Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
