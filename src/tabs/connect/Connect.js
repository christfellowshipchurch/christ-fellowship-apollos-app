import React from 'react';
import { View } from 'react-native';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { BackgroundView } from '@apollosproject/ui-kit';
import { CurrentUserProfile } from 'ChristFellowship/src/profile';
import { GET_LOGIN_STATE } from '@apollosproject/ui-auth';

const Connect = ({ navigation }) => (
  <BackgroundView>
    <Query query={GET_LOGIN_STATE}>
      {({ data }) => {
        if (get(data, 'isLoggedIn', false)) return <CurrentUserProfile />;

        // On logout or when not properly authenitcated
        // navigate back to the Identity screen of the Profile Stack navigator
        navigation.reset({
          routeName: 'Profile',
          params: {},
          action: navigation.navigate({ routeName: 'Identity' }),
        });

        return <View />;
      }}
    </Query>
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
