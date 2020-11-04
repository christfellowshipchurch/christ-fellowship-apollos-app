import React from 'react';
import { createStackNavigator } from 'react-navigation';

import NavigationHeader from 'ui/NavigationHeader';
import { useCurrentUser } from '../hooks';
import EditUser from './EditUser';

const EditCurrentUser = ({ navigation }) => {
  const currentUser = useCurrentUser();
  return <EditUser {...currentUser} navigation={navigation} />;
};

EditCurrentUser.navigationOptions = {
  headerMode: 'float',
  headerTransparent: true,
  header: NavigationHeader,
};

const EditUserNavigator = createStackNavigator(
  {
    EditCurrentUser,
  },
  {
    initialRouteName: 'EditCurrentUser',
    headerMode: 'float',
    headerTransitionPreset: 'fade-in-place',
    navigationOptions: {
      header: null,
    },
  }
);

export default EditUserNavigator;
