import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerItems from './DrawerItems';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ Stack }) => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerItems {...props} />}
    drawerPosition="right"
    // swipeEnabled={false}
    // gestureEnabled={false}
  >
    <Drawer.Screen name="Stack" component={Stack} />
  </Drawer.Navigator>
);

DrawerNavigator.propTypes = {};

export default DrawerNavigator;
