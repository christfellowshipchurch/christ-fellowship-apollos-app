import React from 'react';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import { useLinkRouter } from '../hooks';

const Browser = ({ children }) => {
  const { routeLink } = useLinkRouter();
  return (
    <RockAuthedWebBrowser>
      {(openLinkInternalBrowser) =>
        children((url) => {
          routeLink(url);
        })
      }
    </RockAuthedWebBrowser>
  );
};

Browser.propTypes = {};

export default Browser;
