import URL from 'url';
import querystring from 'querystring';
import { useApolloClient } from '@apollo/client';
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

  if (restrictedQueryParam) {
    openLinkExternal(url);
  } else if (url.startsWith('http')) {
    openLinkInternal(url);
  } else {
    deepLink(url, navigationOptions);
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
      const { data } = await client.query({
        query: GENERATE_APP_LINK,
        variables: { url },
        fetchPolicy: 'cache-first',
      });
      const { inAppLink } = data;

      routeLink(inAppLink, { restrictedQueryParams, navigationOptions });
    },
    loading: false,
    error: null,
  };
};

export default useLinkRouter;
