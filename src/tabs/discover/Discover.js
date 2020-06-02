import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';

import StatusBar from '../../ui/StatusBar';
import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
} from '../../navigation';
import Browse from './Browse';

const Discover = ({ title }) => (
  <BackgroundView>
    <SafeAreaView>
      <NavigationSpacer />
      <StatusBar />
      <Browse />
    </SafeAreaView>
  </BackgroundView>
);

Discover.navigationOptions = (props) =>
  navigationOptions({ ...props, title: 'Discover' });

Discover.propTypes = {
  title: PropTypes.string,
};

Discover.defaultProps = {
  title: 'Discover',
};

export default Discover;
