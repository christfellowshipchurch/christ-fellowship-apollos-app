import Color from 'color';

const dark = ({ colors: themeColors, alpha }) => ({
    colors: {
        primary: themeColors.primary,
        screen: themeColors.black,
        paper: Color(themeColors.darkPrimary)
            .darken(0.5)
            .hex(),

        text: {
            primary: themeColors.lightPrimary,
            secondary: themeColors.lightSecondary,
            tertiary: themeColors.lightTertiary,
            link: themeColors.lightSecondary,
        },
        background: {
            screen: themeColors.black,
            paper: Color(themeColors.darkPrimary)
                .darken(0.5)
                .hex(),
            accent: Color(themeColors.darkTertiary)
                .fade(alpha.medium)
                .hex(),
            inactive: themeColors.darkTertiary,
        },
        shadows: {
            default: themeColors.transparent,
        },
    },
    overrides: {
        'ui-prayer.PrayerExperienceConnected': {
            themeType: 'dark',
        },
    }
});

export default dark;
