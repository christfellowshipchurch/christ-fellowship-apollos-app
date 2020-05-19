import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { get } from 'lodash';
import gql from 'graphql-tag';
import NavigationService from '../../NavigationService';
import { client } from '../../client';

// eslint-disable-next-line import/prefer-default-export
export const openLink = ({ uri }) => {
    Linking.canOpenURL(uri).then((supported) => {
        if (supported) {
            Linking.openURL(uri);
        } else {
            console.log(`Don't know how to open URI: ${uri}`);
        }
    });
};

const RESTRICTED_HOST_NAMES = ['pushpay.com'];
const RESTRICTED_QUERY_PARAMS = ['mobileApp=external'];

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
        return InAppBrowser.open(url);
    }
};

const GENERATE_APP_LINK = gql`
  query generateAppLink($url: String!) {
    inAppLink(url: $url)
  }
`;

export const routeLink = async (url, props) => {
    try {
        const restrictedHostName = RESTRICTED_HOST_NAMES.find((host) =>
            url.includes(host)
        );
        const restrictedQueryParam = RESTRICTED_QUERY_PARAMS.find((param) =>
            url.includes(param)
        );

        if (
            restrictedHostName ||
            restrictedQueryParam ||
            get(props, 'external', false)
        ) {
            openLinkExternal(url);
        } else {
            const { data } = await client.query({
                query: GENERATE_APP_LINK,
                variables: { url },
            });
            const { inAppLink } = data;

            if (inAppLink.startsWith('http')) {
                openLinkInternal(url);
            } else {
                NavigationService.deepLink(inAppLink);
            }
        }
    } catch (e) {
        console.warn(e);
    }
    return false;
};
