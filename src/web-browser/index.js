import React from 'react';
import { withApollo } from 'react-apollo';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import gql from 'graphql-tag';
import NavigationService from '../NavigationService';
import { routeLink } from '../utils/linking';

const Browser = ({ children }) => (
  <RockAuthedWebBrowser>
    {(openLinkInternalBrowser) =>
      children((url) => {
        routeLink(url);
      })
    }
  </RockAuthedWebBrowser>
);

Browser.propTypes = {};

export default Browser;
