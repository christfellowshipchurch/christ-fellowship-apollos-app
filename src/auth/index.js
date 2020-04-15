import React from 'react';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { ThemeMixin } from '@apollosproject/ui-kit';

import {
  AuthSMSPhoneEntryConnected,
  AuthSMSVerificationConnected,
  AuthEmailEntryConnected,
  AuthPasswordEntryConnected,
  AuthProfileEntryConnected,
  AuthProfileDetailsEntryConnected,
} from '@apollosproject/ui-auth';

// import AuthProfileDetailsEntry from './AuthProfileDetailsEntry';
import Entry from './Entry';

export {
  LoginButton,
  ProtectedAction,
  ProtectedTouchable,
  AuthProvider,
  AuthConsumer,
  ProtectedRoute,
  Entry,
} from '@apollosproject/ui-auth';

const StyledEntry = (props) => (
  <ThemeMixin mixin={{ type: 'auth-entry' }}>
    <Entry {...props} />
  </ThemeMixin>
);

const StyledProfileDetailsEntry = (props) => (
  <ThemeMixin mixin={{ type: 'onboarding' }}>
    <AuthProfileDetailsEntry {...props} />
  </ThemeMixin>
);

const AuthNavigator = createStackNavigator(
  {
    AuthSMSPhoneEntryConnected: (props) => (
      <AuthSMSPhoneEntryConnected
        {...props}
        Component={StyledEntry}
        policyInfo="We'll text you a code to make logging in super easy!"
      />
    ),
    AuthSMSVerificationConnected: (props) => (
      <AuthSMSVerificationConnected
        {...props}
        confirmationPromptText="We just sent you a code. Enter it below when it arrives."
      />
    ),
    AuthEmailEntryConnected: (props) => (
      <AuthEmailEntryConnected {...props} Component={StyledEntry} />
    ),
    AuthPasswordEntryConnected,
    AuthProfileEntryConnected,
    AuthProfileDetailsEntryConnected: (props) => (
      <AuthProfileDetailsEntryConnected
        {...props}
        prompt="Help us learn a little more about you so we can connect you with the best ministries and events."
      />
    ),
  },
  {
    initialRouteName: 'AuthSMSPhoneEntryConnected',
    headerMode: 'none',
    navigationOptions: { header: null },
  }
);

AuthNavigator.propTypes = {
  screenProps: PropTypes.shape({
    alternateLoginText: PropTypes.node,
    authTitleText: PropTypes.string,
    confirmationTitleText: PropTypes.string,
    confirmationPromptText: PropTypes.string,
    onFinishAuth: PropTypes.func,
    passwordPromptText: PropTypes.string,
    smsPolicyInfo: PropTypes.node,
    smsPromptText: PropTypes.string,
    emailRequired: PropTypes.bool,
    handleForgotPassword: PropTypes.func,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

const Auth = (props) => <AuthNavigator {...props} screenProps={props} />;
hoistNonReactStatic(Auth, AuthNavigator);

export default Auth;
