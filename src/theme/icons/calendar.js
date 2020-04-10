import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
        <Path
            d="M8.4375 13.5C8.71875 13.5 9 13.2656 9 12.9375V11.0625C9 10.7812 8.71875 10.5 8.4375 10.5H6.5625C6.23438 10.5 6 10.7812 6 11.0625V12.9375C6 13.2656 6.23438 13.5 6.5625 13.5H8.4375ZM13.5 12.9375V11.0625C13.5 10.7812 13.2188 10.5 12.9375 10.5H11.0625C10.7344 10.5 10.5 10.7812 10.5 11.0625V12.9375C10.5 13.2656 10.7344 13.5 11.0625 13.5H12.9375C13.2188 13.5 13.5 13.2656 13.5 12.9375ZM18 12.9375V11.0625C18 10.7812 17.7188 10.5 17.4375 10.5H15.5625C15.2344 10.5 15 10.7812 15 11.0625V12.9375C15 13.2656 15.2344 13.5 15.5625 13.5H17.4375C17.7188 13.5 18 13.2656 18 12.9375ZM13.5 17.4375V15.5625C13.5 15.2812 13.2188 15 12.9375 15H11.0625C10.7344 15 10.5 15.2812 10.5 15.5625V17.4375C10.5 17.7656 10.7344 18 11.0625 18H12.9375C13.2188 18 13.5 17.7656 13.5 17.4375ZM9 17.4375V15.5625C9 15.2812 8.71875 15 8.4375 15H6.5625C6.23438 15 6 15.2812 6 15.5625V17.4375C6 17.7656 6.23438 18 6.5625 18H8.4375C8.71875 18 9 17.7656 9 17.4375ZM18 17.4375V15.5625C18 15.2812 17.7188 15 17.4375 15H15.5625C15.2344 15 15 15.2812 15 15.5625V17.4375C15 17.7656 15.2344 18 15.5625 18H17.4375C17.7188 18 18 17.7656 18 17.4375ZM22.5 5.25C22.5 4.03125 21.4688 3 20.25 3H18V0.5625C18 0.28125 17.7188 0 17.4375 0H15.5625C15.2344 0 15 0.28125 15 0.5625V3H9V0.5625C9 0.28125 8.71875 0 8.4375 0H6.5625C6.23438 0 6 0.28125 6 0.5625V3H3.75C2.48438 3 1.5 4.03125 1.5 5.25V21.75C1.5 23.0156 2.48438 24 3.75 24H20.25C21.4688 24 22.5 23.0156 22.5 21.75V5.25ZM20.25 21.4688C20.25 21.6562 20.1094 21.75 19.9688 21.75H4.03125C3.84375 21.75 3.75 21.6562 3.75 21.4688V7.5H20.25V21.4688Z"
            fill={fill}
        />
    </Svg>
));

Icon.propTypes = {
    size: PropTypes.number,
    fill: PropTypes.string,
};

export default Icon;
