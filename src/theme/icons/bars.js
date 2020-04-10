import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
        <Path
            d="M21.9375 5.8125C22.2188 5.8125 22.5 5.57812 22.5 5.25V3.75C22.5 3.46875 22.2188 3.1875 21.9375 3.1875H2.0625C1.73438 3.1875 1.5 3.46875 1.5 3.75V5.25C1.5 5.57812 1.73438 5.8125 2.0625 5.8125H21.9375ZM21.9375 13.3125C22.2188 13.3125 22.5 13.0781 22.5 12.75V11.25C22.5 10.9688 22.2188 10.6875 21.9375 10.6875H2.0625C1.73438 10.6875 1.5 10.9688 1.5 11.25V12.75C1.5 13.0781 1.73438 13.3125 2.0625 13.3125H21.9375ZM21.9375 20.8125C22.2188 20.8125 22.5 20.5781 22.5 20.25V18.75C22.5 18.4688 22.2188 18.1875 21.9375 18.1875H2.0625C1.73438 18.1875 1.5 18.4688 1.5 18.75V20.25C1.5 20.5781 1.73438 20.8125 2.0625 20.8125H21.9375Z"
            fill={fill}
        />
    </Svg>
));

Icon.propTypes = {
    size: PropTypes.number,
    fill: PropTypes.string,
};

export default Icon;
