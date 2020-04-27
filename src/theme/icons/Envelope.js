import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
        <Path
            d="M20.7344 3.875H3.26562C2.13184 3.875 1.25 4.79883 1.25 5.89062V17.9844C1.25 19.1182 2.13184 20 3.26562 20H20.7344C21.8262 20 22.75 19.1182 22.75 17.9844V5.89062C22.75 4.79883 21.8262 3.875 20.7344 3.875ZM20.7344 5.89062V7.6123C19.7686 8.41016 18.2568 9.58594 15.0654 12.1055C14.3516 12.6514 12.9658 13.9951 12 13.9531C10.9922 13.9951 9.60645 12.6514 8.89258 12.1055C5.70117 9.58594 4.18945 8.41016 3.26562 7.6123V5.89062H20.7344ZM3.26562 17.9844V10.2158C4.18945 10.9717 5.5752 12.0635 7.63281 13.7012C8.55664 14.415 10.1943 16.0107 12 15.9688C13.7637 16.0107 15.3594 14.415 16.3252 13.7012C18.3828 12.0635 19.7686 10.9717 20.7344 10.2158V17.9844H3.26562Z"
            fill={fill}
        />
    </Svg>
));

Icon.propTypes = {
    size: PropTypes.number,
    fill: PropTypes.string,
};

export default Icon;
