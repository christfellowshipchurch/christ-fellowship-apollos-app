import React from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { useCurrentUser } from '../hooks';
import EditUser from './EditUser';

import { CurrentUser, EditAddress, EditProfileDetails } from './screens';

const { Screen, Navigator } = createNativeStackNavigator();

const EditCurrentUser = ({ navigation }) => {
  const currentUser = useCurrentUser();
  return <EditUser {...currentUser} navigation={navigation} />;
};

EditCurrentUser.navigationOptions = {
  headerMode: 'float',
  headerTransparent: true,
};

// TODO : links not working on the profile tab

const EditUserNavigator = ({ route, ...props }) => (
  <Navigator
    {...props}
    headerMode="none"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Screen
      name="CurrentUser"
      component={CurrentUser}
      initialParams={route.params}
    />
    <Screen
      name="EditAddress"
      component={EditAddress}
      initialParams={route.params}
      options={{
        stackPresentation: 'modal',
      }}
    />
    <Screen
      name="EditProfileDetails"
      component={EditProfileDetails}
      initialParams={route.params}
      options={{
        stackPresentation: 'modal',
      }}
    />
  </Navigator>
);

EditUserNavigator.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default EditUserNavigator;
