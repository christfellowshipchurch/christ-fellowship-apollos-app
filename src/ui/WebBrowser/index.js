// Provider API for WebBrowser that injects theme values and defaults to the web browser:
import { Platform } from 'react-native';
import { createContext } from 'react';

import { withTheme } from '@apollosproject/ui-kit';

import Browser from './Browser';

const { Provider: BaseProvider, Consumer } = createContext(Browser.openURL);

const Provider = withTheme(({ theme }) => ({
  value: (url, options = {}) =>
    Browser.openURL(url, {
      ...Platform.select({
        ios: {
          tintColor: theme.colors.primary,
          barTintColor: theme.colors.background.paper,
        },
        android: {
          toolbarColor: theme.colors.background.paper,
          enableDefaultShare: true,
        },
      }),
      ...options,
    }),
}))(BaseProvider);

export default Browser;
export { Provider as WebBrowserProvider, Consumer as WebBrowserConsumer };
