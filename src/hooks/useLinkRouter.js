import URL from 'url';
import querystring from 'querystring';
import { useApolloClient } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import gql from 'graphql-tag';
import { get } from 'lodash';

import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';
import { NavigationService } from '@apollosproject/ui-kit';

const GENERATE_APP_LINK = gql`
  query generateAppLink($url: String!) {
    inAppLink(url: $url)
  }
`;

const deepLink = (rawUrl, navigationOptions) => {
  if (!rawUrl) return;

  const url = URL.parse(rawUrl);
  const route = url.pathname.substring(1);
  const args = querystring.parse(url.query);

  NavigationService.navigate(route, { ...args, ...navigationOptions });
};

const openLinkExternal = (url) =>
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log(`Don't know how to open URI: ${url}`);
    }
  });

const openLinkInternal = (url) => {
  if (url.startsWith('http')) {
    // safe enough to use InAppBrowser
    InAppBrowser.open(url);
  }
};

const routeLink = (url, { restrictedQueryParams, navigationOptions }) => {
  const restrictedQueryParam = restrictedQueryParams.find((param) =>
    url.includes(param)
  );

  /**
   * 1. If the url starts with `christfellowship`, it's a deep link so we can just route it to a deep link.
   * 2. If the url is a restricted url or starts withi something like `mailto:` or `sms:`, we need to use the `Linking` API to route that to an outside link
   * 3. At this point, we know the link is safe to open inside of our in-app browser
   */
  if (url.startsWith('christfellowship')) {
    deepLink(url, navigationOptions);
  } else if (restrictedQueryParam || !url.startsWith('http')) {
    openLinkExternal(url);
  } else {
    openLinkInternal(url);
  }
};

const useLinkRouter = (props) => {
  const client = useApolloClient();
  const restrictedQueryParams = [
    'mobileApp=external',
    ...get(props, 'restrictedQueryParams', []),
  ];

  return {
    openLinkExternal,
    openLinkInternal,
    openDeepLink: deepLink,
    routeLink: async (url, navigationOptions) => {
      try {
        const parsedUrl = URL.parse(url);
        const { protocol } = parsedUrl;

        /**
         * note : in order to support best support non-http protocols (mailto:, sms:, etc), we should check to see if the link is an http protocol before we sending a network request for an inAppLink
         */
        if (protocol.startsWith === 'http') {
          const { data } = await client.query({
            query: GENERATE_APP_LINK,
            variables: { url },
            fetchPolicy: 'cache-first',
          });
          const { inAppLink } = data;

          routeLink(inAppLink, { restrictedQueryParams, navigationOptions });
        } else {
          routeLink(url, {
            restrictedQueryParams,
            navigationOptions,
          });
        }
      } catch (e) {
        console.log(`Unable to follow link: ${url}`);
        console.log({ e });
      }
    },
    loading: false,
    error: null,
  };
};

export default useLinkRouter;
