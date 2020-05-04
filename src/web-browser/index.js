import React from 'react';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import { openLink as openLinkInExternalBrowser } from '../utils/linking';

// TODO : more mature way of handling url parsing
const RESTRICTED_HOST_NAMES = ['pushpay.com'];
const RESTRICTED_QUERY_PARAMS = ['mobileApp=external'];

const Browser = ({ children }) => (
  <RockAuthedWebBrowser>
    {(openLinkInternalBrowser) =>
      children((url) => {
        const restrictedHostName = RESTRICTED_HOST_NAMES.find((host) =>
          url.includes(host)
        );
        const restrictedQueryParam = RESTRICTED_QUERY_PARAMS.find((param) =>
          url.includes(param)
        );

        if (restrictedHostName || restrictedQueryParam) {
          openLinkInExternalBrowser({ uri: url });
        } else {
          openLinkInternalBrowser(url);
        }
      })
    }
  </RockAuthedWebBrowser>
);

Browser.propTypes = {};

export default Browser;
