import Color from 'color';

const authEntry = ({ colors: themeColors, alpha }) => ({
    colors: {
        white: '#000000',
        text: {
            primary: themeColors.darkPrimary,
            secondary: 'white',
            tertiary: themeColors.lightTertiary,
            link: themeColors.tertiary,
        },
        background: {
            screen: 'white',
            paper: themeColors.paper,
            accent: Color(themeColors.darkTertiary)
                .fade(alpha.medium)
                .string(),
            inactive: themeColors.darkTertiary,
        },
        shadows: {
            default: Color(themeColors.darkTertiary)
                .fade(alpha.medium)
                .string(),
        },
        action: {
            default: themeColors.darkTertiary,
            primary: themeColors.primary,
            secondary: themeColors.lightPrimary,
            tertiary: themeColors.tertiary,
        },
    },
    buttons: {
        primary: {
            fill: themeColors.white,
            accent: themeColors.white,
        },
    },
});

export default authEntry;
