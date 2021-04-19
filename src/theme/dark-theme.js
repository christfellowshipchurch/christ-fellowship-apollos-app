import Color from 'color';

const dark = ({ colors: themeColors, alpha }) => ({
  colors: {
    primary: themeColors.primary,
    screen: themeColors.black,
    paper: '#0d0d0d',

    text: {
      primary: themeColors.lightPrimary,
      secondary: themeColors.lightSecondary,
      tertiary: themeColors.lightTertiary,
      link: themeColors.lightSecondary,
    },
    background: {
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
  },
});

export default dark;
