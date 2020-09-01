import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M21.0283 16.4307C20.2305 15.5488 18.6768 14.2471 18.6768 9.92188C18.6768 6.68848 16.4092 4.08496 13.3018 3.41309V2.53125C13.3018 1.81738 12.7139 1.1875 12 1.1875C11.2441 1.1875 10.6562 1.81738 10.6562 2.53125V3.41309C7.54883 4.08496 5.28125 6.68848 5.28125 9.92188C5.28125 14.2471 3.72754 15.5488 2.92969 16.4307C2.67773 16.6826 2.55176 17.0186 2.59375 17.3125C2.59375 18.0264 3.09766 18.6562 3.9375 18.6562H20.0205C20.8604 18.6562 21.3643 18.0264 21.4062 17.3125C21.4062 17.0186 21.2803 16.6826 21.0283 16.4307ZM5.40723 16.6406C6.28906 15.5068 7.25488 13.5332 7.29688 9.96387C7.29688 9.96387 7.29688 9.96387 7.29688 9.92188C7.29688 7.36035 9.39648 5.21875 12 5.21875C14.5615 5.21875 16.7031 7.36035 16.7031 9.92188C16.7031 9.96387 16.6611 9.96387 16.6611 9.96387C16.7031 13.5332 17.6689 15.5068 18.5508 16.6406H5.40723ZM12 22.6875C13.4697 22.6875 14.6455 21.5117 14.6455 20H9.3125C9.3125 21.5117 10.4883 22.6875 12 22.6875Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
