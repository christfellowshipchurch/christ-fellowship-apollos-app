import { createContext } from 'react';
import NavigationService from '../../../NavigationService';

// Can can either call the OpenUserWebView function directly, or call it using the Consuemer.
// Your choice.
export const OpenUserWebView = (url) =>
    NavigationService.navigate('WebView', { url });

const { Provider, Consumer } = createContext(OpenUserWebView);

export {
    Provider as UserWebBrowserProvider,
    Consumer as UserWebBrowserConsumer,
};
