import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';

const Home = () => (
  <SafeAreaView>
    <View style={{ backgroundColor: 'white' }}>
      <Text>Hello There</Text>
    </View>
  </SafeAreaView>
);

Home.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Home;
