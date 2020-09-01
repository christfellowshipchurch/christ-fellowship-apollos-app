import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M9.16667 13.75C8.70833 13.75 8.55556 14.0144 8.55556 14.6667V21.3125C8.55556 21.6992 8.82292 22 9.16667 22H12.8333C13.1389 22 13.4444 21.6992 13.4444 21.3125V14.6667C13.4444 14.2083 13.3633 13.75 12.8333 13.75C12.3034 13.75 9.85417 13.75 9.16667 13.75ZM21.3125 11.8594H17.1111V10.8604C17.1111 10.3447 16.8819 10.1836 16.5 9.92578L11.9167 6.83203V4.8125H14.2083C14.4375 4.8125 14.6667 4.59766 14.6667 4.29688V3.26563C14.6667 3.00781 14.4375 2.75 14.2083 2.75H11.9167V0.515625C11.9167 0.257813 11.6875 0 11.4583 0H10.5417C10.2743 0 10.0833 0.257813 10.0833 0.515625V2.75H7.79167C7.52431 2.75 7.33333 3.00781 7.33333 3.26563V4.29688C7.33333 4.59766 7.52431 4.8125 7.79167 4.8125H10.0833V6.83203L5.46181 9.92578C5.11806 10.1406 4.88889 11.0286 4.88889 11.4583V11.8594H0.649306C0.229167 12.0742 0 12.6328 0 13.2773V21.2695C0 21.6992 0.190972 22 0.496528 22H1.22222C1.52778 22 1.83333 21.6992 1.83333 21.3125V13.5781H4.88889V21.3125C4.88889 21.6992 5.15625 22 5.5 22H6.11111C6.41667 22 6.72222 21.6992 6.72222 21.3125V11.5156L11 8.59375L15.2778 11.5156V21.3125C15.2778 21.6992 15.5451 22 15.8889 22H16.5C16.8056 22 17.1111 21.6992 17.1111 21.3125V13.5781H20.1667V21.3125C20.1667 21.6992 20.434 22 20.7778 22H21.4653C21.7708 22 22 21.6992 22 21.2695V13.2773C22 12.6328 21.7326 12.0742 21.3125 11.8594Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
