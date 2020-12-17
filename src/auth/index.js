import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { ThemeMixin, withTheme } from '@apollosproject/ui-kit';

import {
  AuthSMSPhoneEntryConnected,
  AuthSMSVerificationConnected,
  AuthEmailEntryConnected,
  AuthProfileEntryConnected,
  AuthProfileDetailsEntryConnected,
  Entry,
} from '@apollosproject/ui-auth';

import AuthProfileDetailsEntry from './AuthProfileDetailsEntry';
import AuthPasswordEntryConnected from './AuthPasswordWithPasswordReset';
// import Entry from './Entry';

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
            component={(props) => <AuthEmailEntryConnected {...props} />}
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
      component={AuthPasswordEntryConnected}
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
