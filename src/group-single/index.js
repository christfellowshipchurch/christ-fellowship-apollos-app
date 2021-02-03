import React from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { ModalCloseButton, ModalBackButton } from '@apollosproject/ui-kit';
import GroupSingle from './GroupSingle';
import MembersFeed from './MembersFeed';

const { Screen, Navigator } = createNativeStackNavigator();

const GroupSingleNavigator = ({ route, ...props }) => (
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
      name="GroupSingle"
      component={GroupSingle}
      initialParams={route.params}
    />

    <Screen
      name="GroupMembersFeed"
      component={MembersFeed}
      initialParams={route.params}
      options={{
        title: 'Group Members',
        stackPresentation: 'modal',
        headerRight: ModalCloseButton,
      }}
    />
  </Navigator>
);

GroupSingleNavigator.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default GroupSingleNavigator;
