import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { get } from 'lodash';
import NavigationService from '../NavigationService';

const GENERATE_APP_LINK = gql`
  query generateAppLink($url: String!) {
    inAppLink(url: $url)
  }
`;

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
    NavigationService.deepLink(url);
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
    openDeepLink: NavigationService.deepLink,
    routeLink: async (url) => {
      const { data } = await client.query({
        query: GENERATE_APP_LINK,
        variables: { url },
        fetchPolicy: 'cache-first',
      });
      const { inAppLink } = data;

      routeLink(inAppLink, { restrictedQueryParams });
    },
    loading: false,
    error: null,
  };
};

export default useLinkRouter;
