import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import { makeIcon } from '@apollosproject/ui-kit'

const Like = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 13.832C3 17.4404 5.86133 19.9609 9.95801 19.9609C13.7472 19.9609 16.4796 17.8046 16.8684 14.6255H18.5527C20.3271 14.6255 21.7705 12.9932 21.7705 10.9868C21.7705 8.98096 20.3271 7.34863 18.5527 7.34863H16.916V4H3V13.832ZM16.916 8.84863V13.1255H18.5527C19.5 13.1255 20.2705 12.166 20.2705 10.9868C20.2705 9.80762 19.5 8.84863 18.5527 8.84863H16.916ZM4.19922 13.832V5.2002H15.7168V13.832C15.7168 17.2368 12.8242 18.7607 9.95801 18.7607C7.0918 18.7607 4.19922 17.2368 4.19922 13.832Z"
            fill={fill}
        />
    </Svg>
));

Like.propTypes = {
    size: PropTypes.number,
    fill: PropTypes.string,
};

/* Export your custom icon components here. */
export {
    Like
};
