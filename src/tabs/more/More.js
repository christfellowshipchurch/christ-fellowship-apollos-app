import React, { useState, useEffect } from 'react';
import { Animated, Linking } from 'react-native';
import { get } from 'lodash';
import SafeAreaView from 'react-native-safe-area-view';
import PropTypes from 'prop-types';

import { TableView, Cell } from 'ChristFellowship/src/ui/TableView';

import {
  HeaderSpacer,
  navigationOptions,
  BackgroundView,
  BlurView,
} from '../navigation';

const More = ({ navigation, givingUrl }) => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));

  const setNavigationParam = (params) => {
    navigation.setParams(params);
  };

  useEffect(() => setNavigationParam({ scrollY }), []);

  return (
    <BackgroundView>
      <SafeAreaView forceInset={{ bottom: 'never' }}>
        <Animated.ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
            { useNativeDriver: true },
          ])}
        >
          <HeaderSpacer />
          <TableView title="Get Involved">
            <Cell
              icon="users"
              title="Groups"
              onPress={() =>
                navigation.navigate('InlineWebView', {
                  title: 'Community',
                  uri: 'https://beta.christfellowship.church/community-finder',
                })
              }
            />
            <Cell
              icon="handshake"
              title="Serve"
              onPress={() =>
                navigation.navigate('InlineWebView', {
                  title: 'Serve',
                  uri: 'https://rock.gocf.org/dreamteam',
                })
              }
            />
            <Cell
              icon="envelope-open-dollar"
              title="Give"
              onPress={() =>
                Linking.canOpenURL(givingUrl).then((supported) => {
                  if (supported) {
                    Linking.openURL(givingUrl);
                  } else {
                    console.log(`Don't know how to open URI: ${givingUrl}`);
                  }
                })
              }
            />
          </TableView>

          <TableView title="Our Church" padded>
            <Cell
              title="About Christ Fellowship"
              onPress={() =>
                navigation.navigate('InlineWebView', {
                  title: 'About Christ Fellowship',
                  uri: 'https://beta.christfellowship.church/about',
                })
              }
            />
            <Cell
              title="Church Locations"
              onPress={() =>
                navigation.navigate('InlineWebView', {
                  title: 'Church Locations',
                  uri: 'https://beta.christfellowship.church/locations',
                })
              }
            />
            <Cell
              title="Contact Us"
              onPress={() =>
                navigation.navigate('InlineWebView', {
                  title: 'Contact Us',
                  uri: 'https://gochristfellowship.com/new-here/contact-us',
                })
              }
            />
          </TableView>
        </Animated.ScrollView>
      </SafeAreaView>
    </BackgroundView>
  );
};

More.navigationOptions = ({ navigation, theme }) => ({
  ...navigationOptions,
  headerTitleStyle: {
    ...navigationOptions.headerTitleStyle,
    color: theme === 'dark' ? 'white' : 'black',
  },
  headerBackground: (
    <BlurView
      scrollY={get(navigation, 'state.params.scrollY', new Animated.Value(0))}
    />
  ),
  title: 'More',
});

More.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  givingUrl: PropTypes.string,
};

More.defaultProps = {
  givingUrl: 'https://pushpay.com/g/christfellowship',
};

export default More;
