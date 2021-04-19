import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { get } from 'lodash';

import { AuthPasswordEntryConnected } from '@apollosproject/ui-auth';
import RockAuthedWebBrowser from '../web-browser';
import { track } from '../amplitude';

const GET_PASSWORD_RESET_URL = gql`
  query getPasswordResetUrl {
    passwordResetUrl
  }
`;

const AuthPasswordWithPasswordReset = (props) => {
  const { loading, error, data } = useQuery(GET_PASSWORD_RESET_URL, {
    fetchPolicy: 'network-only',
  });

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => {
        const passwordResetUrl = get(data, 'passwordResetUrl', '');
        const handleForgotPassword =
          loading || error || !passwordResetUrl || passwordResetUrl === ''
            ? null
            : () => openUrl(passwordResetUrl);

        return (
          <AuthPasswordEntryConnected
            {...props}
            handleForgotPassword={handleForgotPassword}
          />
        );
      }}
    </RockAuthedWebBrowser>
  );
};

export default AuthPasswordWithPasswordReset;
