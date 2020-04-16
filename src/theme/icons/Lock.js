import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
        <Path
            d="M12 18.4883C12.6299 18.4883 13.1758 17.9844 13.1758 17.3125V14.625C13.1758 13.9951 12.6299 13.4492 12 13.4492C11.3281 13.4492 10.8242 13.9951 10.8242 14.625V17.3125C10.8242 17.9844 11.3281 18.4883 12 18.4883ZM21.4062 11.2656C21.4062 10.1738 20.4824 9.25 19.3906 9.25H18.0469V7.31836C18.0469 3.95898 15.3594 1.22949 12 1.1875C8.64062 1.1875 5.95312 3.91699 5.95312 7.23438V9.25H4.60938C3.47559 9.25 2.59375 10.1738 2.59375 11.2656V20.6719C2.59375 21.8057 3.47559 22.6875 4.60938 22.6875H19.3906C20.4824 22.6875 21.4062 21.8057 21.4062 20.6719V11.2656ZM7.96875 9.25V7.23438C7.96875 5.05078 9.77441 3.20312 12 3.20312C14.1836 3.20312 16.0312 5.05078 16.0312 7.23438V9.25H7.96875ZM19.3906 11.2656V20.6719H4.60938V11.2656H19.3906Z"
            fill={fill}
        />
    </Svg>
));

Icon.propTypes = {
    size: PropTypes.number,
    fill: PropTypes.string,
};

export default Icon;
