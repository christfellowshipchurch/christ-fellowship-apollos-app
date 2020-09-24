import merge from 'lodash/merge';

import { lightenBy, darkenBy } from 'utils/theme';

import { defaultTheme as packageTheme } from './theme';

export default function mapTheme(appTheme) {
  /*
   * Map the CF/Apollos theme (appTheme) to the Stream Chat theme (packageTheme).
   */

  const { colors, type } = appTheme;

  const backgroundColor =
    type === 'light'
      ? darkenBy(colors.background.screen, 0.02).hex()
      : lightenBy(colors.background.screen, 0.25).hex();

  const mappedTheme = {
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      danger: colors.alert,
      light: backgroundColor,
      textLight: colors.text.tertiary,
      textGrey: colors.text.secondary,
      textDark: colors.text.primary,
      transparent: colors.transparent,
    },
    channelPreview: {
      container: {
        css: {
          borderBottomColor: backgroundColor,
        },
      },
      title: {
        css: {
          color: colors.text.primary,
        },
      },
      date: {
        css: {
          color: colors.text.tertiary,
        },
      },
      message: {
        color: colors.text.secondary,
        unreadColor: colors.text.primary,
      },
    },
    iconSquare: {
      container: {
        css: {
          backgroundColor,
        },
      },
    },
    message: {
      content: {
        metaText: {
          css: {
            color: colors.text.tertiary,
          },
        },
        textContainer: {
          leftBorderWidth: 1,
          leftBorderColor: backgroundColor,
          rightBorderWidth: 0,
          rightBorderColor: colors.background.transparent,
        },
        text: {
          color: colors.text.primary,
        },
      },
    },
    messageInput: {
      container: {
        css: {
          backgroundColor,
        },
      },
      inputBox: {
        css: {
          color: colors.text.primary,
        },
      },
      editingBoxContainer: {
        css: {
          backgroundColor,
        },
      },
    },
    messageList: {
      messageNotification: {
        text: {
          css: {
            color: colors.text.secondary,
          },
        },
      },
      dateSeparator: {
        line: {
          css: {
            height: 1,
          },
        },
        date: {
          css: {
            color: colors.text.secondary,
          },
        },
      },
      messageSystem: {
        text: {
          css: {
            color: colors.text.secondary,
          },
        },
        dateText: {
          css: {
            color: colors.text.secondary,
          },
        },
      },
      eventIndicator: {
        memberUpdateText: {
          css: {
            color: colors.text.secondary,
          },
        },
      },
    },
  };

  return merge({}, packageTheme, mappedTheme);
}
