import merge from 'lodash/merge';
import { StyleSheet } from 'react-native';

import { lightenBy, darkenBy } from 'utils/theme';

import { defaultTheme as packageTheme } from './theme';

export default function mapTheme(appTheme) {
  /*
   * Map the CF/Apollos theme (appTheme) to the Stream Chat theme (packageTheme).
   */

  const { colors, sizing, helpers, typography, type } = appTheme;

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
    avatar: {
      text: {
        css: {
          color: colors.background.paper,
          fontFamily: typography.sans.regular.default,
        },
      },
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
          fontFamily: typography.sans.regular.default,
        },
      },
      date: {
        css: {
          color: colors.text.tertiary,
          fontFamily: typography.sans.regular.default,
        },
      },
      message: {
        color: colors.text.secondary,
        unreadColor: colors.text.primary,
        css: {
          fontFamily: typography.sans.regular.default,
        },
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
        textContainer: {
          leftBorderWidth: 1,
          leftBorderColor: backgroundColor,
          rightBorderWidth: 0,
          rightBorderColor: colors.background.transparent,
        },
        text: {
          color: colors.text.primary,
          fontFamily: typography.sans.regular.default,
        },
        metaText: {
          css: {
            fontFamily: typography.sans.regular.default,
          },
        },
      },
      reactionList: {
        container: {
          css: {
            backgroundColor,
          },
        },
        reactionCount: {
          css: {
            color: colors.text.primary,
            fontFamily: typography.sans.regular.default,
            backgroundColor,
          },
        },
      },
      reactionPicker: {
        containerView: {
          css: {
            backgroundColor,
            borderColor: colors.text.tertiary,
            borderWidth: StyleSheet.hairlineWidth,
          },
        },
        text: {
          css: {
            color: colors.text.primary,
            fontFamily: typography.sans.regular.default,
          },
        },
      },
    },
    messageInput: {
      container: {
        css: {
          backgroundColor,
          borderRadius: helpers.rem(2),
        },
      },
      inputBox: {
        css: {
          color: colors.text.primary,
          fontFamily: typography.sans.regular.default,
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
            fontFamily: typography.sans.regular.default,
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
            fontFamily: typography.sans.regular.default,
          },
        },
      },
      messageSystem: {
        text: {
          css: {
            color: colors.text.secondary,
            fontFamily: typography.sans.regular.default,
          },
        },
        dateText: {
          css: {
            color: colors.text.secondary,
            fontFamily: typography.sans.regular.default,
          },
        },
      },
      eventIndicator: {
        memberUpdateText: {
          css: {
            color: colors.text.secondary,
            fontFamily: typography.sans.regular.default,
          },
        },
      },
    },
  };

  return merge({}, packageTheme, mappedTheme);
}
