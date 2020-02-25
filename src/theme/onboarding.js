import Color from 'color';

const onboarding = ({ colors: themeColors, alpha }) => ({
    override: {
        'InputUnderline.blurred': {
            backgroundColor: '#ffffff',
        },
        'InputUnderline.focused': {
            backgroundColor: '#ffffff',
        },
    },
    colors: {
        white: '#000000',
        text: {
            primary: themeColors.lightPrimary,
            secondary: themeColors.lightSecondary,
            tertiary: themeColors.lightTertiary,
            link: themeColors.tertiary,
        },
        background: {
            screen: themeColors.lightPrimary,
            paper: themeColors.transparent,
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
});

export default onboarding;
