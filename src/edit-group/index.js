import React from 'react';
import { createStackNavigator } from 'react-navigation';

import NavigationHeader from '../ui/NavigationHeader';
import EditGroupConnected from './EditGroup';

const EditGroup = ({ navigation }) => (
  <EditGroupConnected navigation={navigation} />
);

EditGroup.navigationOptions = {
  headerMode: 'float',
  headerTransparent: true,
  header: NavigationHeader,
};

const EditGroupNavigator = createStackNavigator(
  {
    EditGroup,
  },
  {
    initialRouteName: 'EditGroup',
    headerMode: 'float',
    headerTransitionPreset: 'fade-in-place',
    navigationOptions: {
      header: null,
    },
  }
);

export default EditGroupNavigator;
