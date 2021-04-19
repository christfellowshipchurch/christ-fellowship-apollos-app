import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { View } from 'react-native';
import {
  styled,
  withMediaQuery,
  UIText,
  Touchable,
} from '@apollosproject/ui-kit';

import EditGroupConnected from './EditGroup';
import EditGroupCoverImageConnected from './EditGroupCoverImage';
import AddContentItemConnected from './AddContentItemConnected';

const { Screen, Navigator } = createNativeStackNavigator();

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

const CloseButtonText = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(UIText);

const CloseButtonSpacing = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 0.5, // note : hack to make the tappable area larger/easier to press
}))(View);

// :: Components
// ------------------------------------------------------------------

const CloseButton = () => {
  const navigation = useNavigation();
  const onPress = () => navigation.goBack(null);
  return (
    <Touchable onPress={onPress}>
      <CloseButtonSpacing>
        <CloseButtonText bold>Close</CloseButtonText>
      </CloseButtonSpacing>
    </Touchable>
  );
};

CloseButton.propTypes = {
  onPress: PropTypes.func,
};

// :: Core Component
// ------------------------------------------------------------------

const EditGroupNavigator = ({ route, ...props }) => (
  <Navigator
    initialRouteName="EditGroup"
    {...props}
    screenOptions={{
      headerRight: CloseButton,
    }}
  >
    <Screen
      name="AddContentItem"
      component={AddContentItemConnected}
      initialParams={route.params}
      options={{
        title: 'Select Study',
      }}
    />
    <Screen
      name="EditGroup"
      component={EditGroupConnected}
      initialParams={route.params}
      options={{
        title: 'Edit Group',
      }}
    />
    <Screen
      name="EditGroupCoverImage"
      component={EditGroupCoverImageConnected}
      initialParams={route.params}
      options={{
        title: 'Select Photo',
      }}
    />
  </Navigator>
);

EditGroupNavigator.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default EditGroupNavigator;
