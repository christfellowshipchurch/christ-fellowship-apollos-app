import Color from 'color';

const onboarding = ({ colors: themeColors, alpha, sizing }) => ({
  overrides: {
    'InputUnderline.blurred': {
      backgroundColor: '#ffffff',
    },
    'InputUnderline.focused': {
      backgroundColor: '#ffffff',
    },
    'Onboarding.SlideContent.Title': {
      paddingTop: sizing.baseUnit * 2,
    },
    'Onboarding.Slide.SkipButton': {
      color: 'white',
    },
    'SideBySideView.Right': {
      backgroundColor: 'white',
    },
    H5: {
      color: 'black',
    },
    H6: {
      color: themeColors.darkTertiary,
    },
  },
  colors: {
    white: '#000000', // ui hack to get Button text to be dark
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
  buttons: {
    primary: {
      fill: '#ffffff',
      accent: '#000000',
    },
  },
});

export default onboarding;
