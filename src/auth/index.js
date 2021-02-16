import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {
  AuthSMSPhoneEntryConnected,
  AuthSMSVerificationConnected,
  AuthEmailEntryConnected,
  AuthProfileEntryConnected,
  AuthProfileDetailsEntryConnected,
  Entry,
} from '@apollosproject/ui-auth';

import { withTheme } from '@apollosproject/ui-kit';
import AuthProfileDetailsEntry from './AuthProfileDetailsEntry';
import AuthPasswordWithPasswordReset from './AuthPasswordWithPasswordReset';

// import Entry from './Entry';

/**
 * We use a custom Auth Navigator Stack cause we need to be able to check the age of new users to make sure that they are at least 13 years old.
 */
export {
  LoginButton,
  ProtectedAction,
  ProtectedTouchable,
  AuthProvider,
  AuthConsumer,
  ProtectedRoute,
  Entry,
} from '@apollosproject/ui-auth';

const AuthStack = createNativeStackNavigator();
const IdentityStack = createNativeStackNavigator();

const AuthNavigator = (props) => (
  <AuthStack.Navigator
    initialRouteName="AuthIdentity"
    headerMode="none"
    {...props}
  >
    <AuthStack.Screen name="Identity">
      {() => (
        <IdentityStack.Navigator
          screenOptions={{ stackAnimation: 'none', headerShown: false }}
        >
          <IdentityStack.Screen
            name="AuthSMSPhoneEntryConnected"
            component={(props) => (
              <AuthSMSPhoneEntryConnected
                {...props}
                policyInfo="We'll text you a code to make logging in super easy!"
              />
            )}
          />
          <IdentityStack.Screen
            name="AuthEmailEntryConnected"
            component={AuthEmailEntryConnected}
          />
        </IdentityStack.Navigator>
      )}
    </AuthStack.Screen>
    <AuthStack.Screen
      name="AuthSMSVerificationConnected"
      component={(props) => (
        <AuthSMSVerificationConnected
          {...props}
          confirmationPromptText="We just sent you a code. Enter it below when it arrives."
        />
      )}
    />
    <AuthStack.Screen
      name="AuthPasswordEntryConnected"
      component={AuthPasswordWithPasswordReset}
    />
    <AuthStack.Screen
      name="AuthProfileEntryConnected"
      component={AuthProfileEntryConnected}
    />
    <AuthStack.Screen
      name="AuthProfileDetailsEntryConnected"
      component={(props) => (
        <AuthProfileDetailsEntryConnected
          {...props}
          Component={AuthProfileDetailsEntry}
        />
      )}
    />

    {/* Redirects */}
    <AuthStack.Screen name="AuthSMSPhoneEntryConnected">
      {({ navigation }) =>
        navigation.replace('Identity', {
          screen: 'AuthSMSPhoneEntryConnected',
        }) || null
      }
    </AuthStack.Screen>
    <AuthStack.Screen name="AuthEmailEntryConnected">
      {({ navigation }) =>
        navigation.replace('Identity', {
          screen: 'AuthEmailEntryConnected',
        }) || null
      }
    </AuthStack.Screen>
  </AuthStack.Navigator>
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

const ThemedAuthNavigator = withTheme(({ theme, ...props }) => ({
  ...props,
  screenOptions: {
    headerTintColor: theme.colors.action.secondary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    headerStyle: {
      backgroundColor: theme.colors.background.paper,
    },
    headerHideShadow: true,
    headerTitle: '',
    headerBackTitle: 'Back',
  },
}))(AuthNavigator);

ThemedAuthNavigator.propTypes = {
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

const Auth = (props) => <ThemedAuthNavigator {...props} />;
hoistNonReactStatic(Auth, AuthNavigator);

export default Auth;
