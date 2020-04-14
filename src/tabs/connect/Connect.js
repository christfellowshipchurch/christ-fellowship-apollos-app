import React from 'react';
import { View, Text } from 'react-native';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { BackgroundView, H1 } from '@apollosproject/ui-kit';

const Connect = ({ navigation }) => (
  <BackgroundView>
    <H1>User Profile</H1>
  </BackgroundView>
);

Connect.navigationOptions = {
  title: 'Profile',
  header: null,
};

Connect.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Connect;
