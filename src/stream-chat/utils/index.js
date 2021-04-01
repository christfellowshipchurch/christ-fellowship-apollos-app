/**
 * utils.js
 *
 * Author: Caleb Panza
 * Created: Apr 01, 2021
 *
 * Utility methods to help maintain an easy setup for Stream.IO
 */

import Color from 'color';

// eslint-disable-next-line import/prefer-default-export
export const mapThemeValues = (apollosTheme) => {
  if (apollosTheme) {
    return {
      dark: apollosTheme?.type === 'dark',
      colors: {
        accent_blue: apollosTheme.colors.primary,
        accent_green: apollosTheme.colors.success,
        accent_red: apollosTheme.colors.alert,
        black: apollosTheme.colors.text.primary,
        blue_alice: Color(apollosTheme.colors.background.screen)
          .mix(Color(apollosTheme.colors.primary), 0.15)
          .hex(),
        border: Color(apollosTheme.colors.background.screen)
          .mix(Color(apollosTheme.colors.text.primary), 0.1)
          .hex(),
        icon_background: apollosTheme.colors.background.paper,
        grey: Color(apollosTheme.colors.background.screen)
          .mix(Color(apollosTheme.colors.text.primary))
          .hex(),
        grey_gainsboro: Color(apollosTheme.colors.background.screen)
          .mix(Color(apollosTheme.colors.text.secondary))
          .hex(),
        grey_whisper: Color(apollosTheme.colors.background.screen)
          .mix(Color(apollosTheme.colors.text.tertiary))
          .hex(),
        targetedMessageBackground: apollosTheme.colors.background.paper,
        white: apollosTheme.colors.background.paper,
        white_smoke: apollosTheme.colors.background.screen,
        white_snow: apollosTheme.colors.background.screen,
      },
      dateHeader: {
        container: {
          backgroundColor: apollosTheme.colors.text.tertiary,
        },
        text: {
          color: apollosTheme.colors.background.screen,
        },
      },
      messageSimple: {
        content: {
          containerInner: {
            backgroundColor: apollosTheme.colors.background.paper,
            borderColor: apollosTheme.colors.background.paper,
          },
        },
      },
      overlay: {
        reactionsLists: {
          reaction: {
            color: apollosTheme.colors.primary,
          },
        },
      },
    };
  }

  return {};
};
