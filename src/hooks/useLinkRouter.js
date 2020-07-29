import URL from 'url';
import querystring from 'querystring';
import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { NavigationService } from '@apollosproject/ui-kit';

const GENERATE_APP_LINK = gql`
  query generateAppLink($url: String!) {
    inAppLink(url: $url)
  }
`;

const deepLink = (rawUrl) => {
  if (!rawUrl) return;

  const url = URL.parse(rawUrl);
  const route = url.pathname.substring(1);
  const args = querystring.parse(url.query);

  NavigationService.navigate(route, args);
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

const routeLink = (url, { restrictedQueryParams }) => {
  const restrictedQueryParam = restrictedQueryParams.find((param) =>
    url.includes(param)
  );

  if (restrictedQueryParam) {
    openLinkExternal(url);
  } else if (url.startsWith('http')) {
    openLinkInternal(url);
  } else {
    deepLink(url);
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
    routeLink: async (url) => {
      const { data } = await client.query({
        query: GENERATE_APP_LINK,
        variables: { url },
        fetchPolicy: 'cache-first',
      });
      const { inAppLink } = data;

      console.log({ inAppLink });

      routeLink(inAppLink, { restrictedQueryParams });
    },
    loading: false,
    error: null,
  };
};

export default useLinkRouter;
