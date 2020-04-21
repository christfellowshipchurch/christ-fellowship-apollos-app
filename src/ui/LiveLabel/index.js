import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme, Icon, H6 } from '@apollosproject/ui-kit';
import BlurView from '../BlurView';

const LiveIcon = withTheme(({ theme }) => ({
    name: 'live-dot',
    size: theme.helpers.rem(0.4375),
    fill: theme.colors.alert,
    style: { marginRight: theme.sizing.baseUnit * 0.3 },
}))(Icon);

const LiveLabel = withTheme()(
    ({ theme, BackgroundComponent, blurType, style }) => {
        const Component = BackgroundComponent || View;
        const calculatedStyle = BackgroundComponent
            ? {
                borderRadius: theme.sizing.baseBorderRadius,
                backgroundColor: theme.colors.background.screen,
                padding: theme.sizing.baseUnit * 0.3,
                marginLeft: -theme.sizing.baseUnit * 0.5,
                marginBottom: theme.sizing.baseUnit * 0.5,
                flexDirection: 'row',
                alignItems: 'center',
            }
            : {};

        return (
            <Component
                style={{
                    ...calculatedStyle,
                    flexDirection: 'row',
                    alignItems: 'center',
                    ...style,
                }}
                blurType={blurType}
            >
                <LiveIcon />
                <H6
                    style={{
                        color: theme.colors.alert,
                        textTransform: 'uppercase',
                        fontSize: 12,
                    }}
                    numberOfLines={2}
                >
                    LIVE NOW
        </H6>
            </Component>
        );
    }
);

LiveLabel.propTypes = {
    BackgroundComponent: PropTypes.oneOf([View, BlurView, null]),
    blurType: PropTypes.string,
};

LiveLabel.defaultProps = {
    BackgroundComponent: null,
    blurType: 'thickMaterial',
};

LiveLabel.displayName = 'LiveLabel';

export default LiveLabel;
