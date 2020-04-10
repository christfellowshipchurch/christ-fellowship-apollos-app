import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 24 25" {...otherProps}>
        <Path
            d="M23.8125 21.9844L18.1406 16.3125C18 16.2188 17.8594 16.125 17.7188 16.125H17.1094C18.5625 14.4375 19.5 12.1875 19.5 9.75C19.5 4.40625 15.0938 0 9.75 0C4.35938 0 0 4.40625 0 9.75C0 15.1406 4.35938 19.5 9.75 19.5C12.1875 19.5 14.3906 18.6094 16.125 17.1562V17.7656C16.125 17.9062 16.1719 18.0469 16.2656 18.1875L21.9375 23.8594C22.1719 24.0938 22.5469 24.0938 22.7344 23.8594L23.8125 22.7812C24.0469 22.5938 24.0469 22.2188 23.8125 21.9844ZM9.75 17.25C5.57812 17.25 2.25 13.9219 2.25 9.75C2.25 5.625 5.57812 2.25 9.75 2.25C13.875 2.25 17.25 5.625 17.25 9.75C17.25 13.9219 13.875 17.25 9.75 17.25Z"
            fill={fill}
        />
    </Svg>
));

Icon.propTypes = {
    size: PropTypes.number,
    fill: PropTypes.string,
};

export default Icon;
