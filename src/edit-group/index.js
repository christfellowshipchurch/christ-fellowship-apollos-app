import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { createStackNavigator, SafeAreaView } from 'react-navigation';

import {
  styled,
  BodyText,
  BackgroundView,
  withMediaQuery,
} from '@apollosproject/ui-kit';

import NavigationHeader from '../ui/NavigationHeader';
import EditGroupConnected from './EditGroup';
import EditGroupCoverImageConnected from './EditGroupCoverImage';

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

const RouteContainer = ({ children }) => (
  <BackgroundView>
    <StatusBar hidden />
    <KeyboardAvoidingView behavior={'padding'}>
      <ScrollView>
        <ContentContainer>
          <SafeAreaView forceInset={{ top: 'always' }}>{children}</SafeAreaView>
        </ContentContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  </BackgroundView>
);
RouteContainer.propTypes = {
  children: PropTypes.node,
};

const EditGroup = ({ navigation }) => (
  <RouteContainer>
    <EditGroupConnected navigation={navigation} />
  </RouteContainer>
);

EditGroup.navigationOptions = {
  headerMode: 'float',
  headerTransparent: true,
  header: NavigationHeader,
};

const EditGroupCoverImage = ({ navigation }) => (
  <RouteContainer>
    <EditGroupCoverImageConnected navigation={navigation} />
  </RouteContainer>
);

EditGroupCoverImage.navigationOptions = {
  headerMode: 'float',
  headerTransparent: true,
  header: NavigationHeader,
};

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
