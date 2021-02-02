import React from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { ModalCloseButton, ModalBackButton } from '@apollosproject/ui-kit';
import { useCurrentUser } from '../hooks';
import EditUser from './EditUser';

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
    headerMode="screen"
    screenOptions={{
      headerTranslucent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerHideShadow: true,
      headerRight: ModalCloseButton,
      headerLeft: ModalBackButton,
      headerTitle: '',
    }}
  >
    <Screen
      name="EditCurrentUser"
      component={EditCurrentUser}
      initialParams={route.params}
    />
  </Navigator>
);

EditUserNavigator.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default EditUserNavigator;
