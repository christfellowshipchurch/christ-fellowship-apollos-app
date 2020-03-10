import Color from 'color';

const dark = ({ colors: themeColors, alpha }) => ({
    overrides: {
        Card: {
            Content: {
                borderColor: themeColors.white,
                borderWidth: 1,
            },
        },
    },
    colors: {
        primary: themeColors.primary,
        screen: themeColors.black,
        paper: Color(themeColors.darkPrimary).darken(0.5),

        text: {
            primary: themeColors.lightPrimary,
            secondary: themeColors.lightSecondary,
            tertiary: themeColors.lightTertiary,
            link: themeColors.lightSecondary,
        },
        background: {
            screen: themeColors.black,
            paper: Color(themeColors.darkPrimary).darken(0.5),
            accent: Color(themeColors.darkTertiary)
                .fade(alpha.medium)
                .string(),
            inactive: themeColors.darkTertiary,
        },
        shadows: {
            default: themeColors.transparent,
        },
        action: {
            default: themeColors.primary,
            primary: themeColors.primary,
            secondary: themeColors.secondary,
            tertiary: themeColors.tertiary,
        },
    },
});

export default dark;
