import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
        <Path
            d="M24.4639 7.86426L18.417 1.81738C17.1572 0.557617 15.0156 1.43945 15.0156 3.24512V5.63867C13.21 5.72266 11.4463 5.89062 9.93457 6.39453C8.46484 6.85645 7.28906 7.52832 6.44922 8.45215C5.44141 9.58594 4.9375 10.9717 4.9375 12.6094C4.9375 15.2129 6.32324 17.3545 8.46484 18.6982C10.0605 19.7061 12.0762 18.1943 11.4463 16.3467C10.8164 14.373 10.7324 13.4072 15.0156 13.0713V15.2969C15.0156 17.1025 17.1572 17.9844 18.417 16.7246L24.4639 10.6777C25.2617 9.92188 25.2617 8.62012 24.4639 7.86426ZM17.0312 15.2969V10.9717C11.6143 11.0557 7.87695 11.9375 9.55664 16.9766C8.29688 16.2207 6.95312 14.835 6.95312 12.6094C6.95312 8.03223 12.3701 7.6123 17.0312 7.6123V3.20312L23.0781 9.25L17.0312 15.2969ZM18.0391 18.8662C17.8291 18.9082 17.7031 19.1182 17.7031 19.3701V20.4199C17.7031 20.5879 17.5771 20.6719 17.4512 20.6719H3.17383C3.00586 20.6719 2.92188 20.5879 2.92188 20.4199V6.14258C2.92188 6.0166 3.00586 5.89062 3.17383 5.89062H6.78516C6.82715 5.89062 6.95312 5.89062 7.03711 5.84863C7.54102 5.55469 8.04492 5.26074 8.63281 5.05078C8.84277 4.9668 8.96875 4.79883 8.96875 4.58887V4.37891C8.96875 4.12695 8.7168 3.875 8.46484 3.875H2.92188C1.78809 3.875 0.90625 4.79883 0.90625 5.89062V20.6719C0.90625 21.8057 1.78809 22.6875 2.92188 22.6875H17.7031C18.7949 22.6875 19.7188 21.8057 19.7188 20.6719V18.9082C19.7188 18.5303 19.2568 18.2783 18.9209 18.4883C18.7109 18.6143 18.291 18.7822 18.0391 18.8662Z"
            fill={fill}
        />
    </Svg>
));

Icon.propTypes = {
    size: PropTypes.number,
    fill: PropTypes.string,
};

export default Icon;
