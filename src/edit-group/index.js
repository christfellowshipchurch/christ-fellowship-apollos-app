import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import { styled, withMediaQuery } from '@apollosproject/ui-kit';

import NavigationHeader from '../ui/NavigationHeader';
import EditGroupConnected from './EditGroup';
import EditGroupCoverImageConnected from './EditGroupCoverImage';

const SHARED_NAVIGATION_OPTIONS = {
  headerMode: 'float',
  headerTransparent: true,
  header: NavigationHeader,
};

// :: Styled Components
// ------------------------------------------------------------------

export const ContentContainer = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
  })),
  styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
    width: 500,
    alignSelf: 'center',
  }))
)(View);

// :: Routes
// ------------------------------------------------------------------

const EditGroup = ({ navigation }) => (
  <EditGroupConnected navigation={navigation} />
);
EditGroup.navigationOptions = SHARED_NAVIGATION_OPTIONS;

const EditGroupCoverImage = ({ navigation }) => (
  <EditGroupCoverImageConnected navigation={navigation} />
);
EditGroupCoverImage.navigationOptions = SHARED_NAVIGATION_OPTIONS;

// :: Core Component
// ------------------------------------------------------------------

const EditGroupNavigator = createStackNavigator(
  {
    EditGroup,
    EditGroupCoverImage,
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
