import Color from 'color';

const lightenBy = (color, ratio) => {
  const lightness = color.lightness();
  return color.lightness(lightness + (100 - lightness) * ratio);
};

const dark = ({ colors: themeColors, alpha }) => ({
  colors: {
    primary: themeColors.primary,
    screen: themeColors.black,
    paper: lightenBy(Color(themeColors.black), 0.09).hex(),

    text: {
      primary: themeColors.lightPrimary,
      secondary: themeColors.lightSecondary,
      tertiary: themeColors.lightTertiary,
      link: themeColors.lightSecondary,
    },
    background: {
      screen: themeColors.black,
      paper: lightenBy(Color(themeColors.black), 0.09).hex(),
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
