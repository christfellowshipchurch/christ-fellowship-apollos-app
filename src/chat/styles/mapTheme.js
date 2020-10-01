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
        textContainer: {
          leftBorderWidth: 1,
          leftBorderColor: backgroundColor,
          rightBorderWidth: 0,
          rightBorderColor: colors.background.transparent,
        },
        text: {
          color: colors.text.primary,
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
          },
        },
      },
    },
    messageInput: {
      container: {
        css: {
          backgroundColor,
          borderRadius: sizing.baseBorderRadius,
        },
      },
      inputBox: {
        css: {
          color: colors.text.primary,
          fontSize: helpers.rem(0.875),
          fontFamily: typography.ui.regular,
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
