import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { withTheme, Icon } from '@apollosproject/ui-kit';

export const CircleCheckIcon = withTheme(({ theme, size }) => ({
    fill: theme.colors.success,
    name: 'circle-outline-check-mark',
    size,
}))(Icon);

export default withTheme()(({ theme }) => {
    const ICON_SIZE = 72;
    const MIN = 0;
    const MAX = 1;
    const duration = 350;
    const iconScale = useRef(new Animated.Value(MIN)).current;
    const backgroundScale = useRef(new Animated.Value(MIN)).current;
    const backgroundOpacity = useRef(new Animated.Value(0)).current;
    const handleAnimation = () => {
        Animated.parallel(
            [
                // Scale the icon from 0 to 1
                Animated.timing(iconScale, {
                    toValue: MAX,
                    duration,
                }),
                Animated.sequence(
                    [
                        Animated.parallel([
                            // Scale the background from 0 to 1
                            Animated.timing(backgroundScale, {
                                toValue: MAX,
                                duration,
                            }),
                            // Set opacity from 0 to 0.2
                            Animated.timing(backgroundOpacity, {
                                toValue: 0.1,
                                duration,
                            }),
                        ]),
                        Animated.parallel([
                            // Scale the background from 0 to 1
                            Animated.timing(backgroundScale, {
                                toValue: 2,
                                duration,
                            }),
                            // Set opacity from 0 to 0.2
                            Animated.timing(backgroundOpacity, {
                                toValue: 0,
                                duration,
                            }),
                        ]),
                    ],
                    { stopTogether: false }
                ),
            ],
            { stopTogether: false }
        ).start();
    };

    useEffect(
        () => {
            handleAnimation();
        },
        [iconScale, backgroundScale]
    );

    return (
        <Animated.View
            style={{
                opacity: iconScale,
                transform: [{ scale: iconScale }],
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Animated.View
                style={{
                    position: 'absolute',
                    height: ICON_SIZE,
                    width: ICON_SIZE,
                    borderRadius: ICON_SIZE * 0.5,
                    backgroundColor: theme.colors.success,
                    opacity: backgroundOpacity,
                    transform: [{ scale: backgroundScale }],
                }}
            />
            <CircleCheckIcon size={ICON_SIZE} />
        </Animated.View>
    );
});
