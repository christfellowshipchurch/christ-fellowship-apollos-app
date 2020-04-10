import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import { Image, Animated, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { styled, FeedView } from '@apollosproject/ui-kit';

import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';
import {
  navigationOptions,
  BackgroundView,
  NavigationBackground,
  NavigationSpacer,
  HEADER_OFFSET,
} from '../navigation';
import { LiveButton } from '../../live';
import StatusBar from '../../ui/StatusBar';

import fetchMoreResolver from '../../utils/fetchMoreResolver';

import ActionMapper from './ActionMapper';
import GET_FEED_FEATURES from './getFeedFeatures';

import WordmarkImg from './wordmark.png';
import WordmarkVariantImg from './wordmark_variant.png';

const DynamicWordmark = new DynamicValue(WordmarkImg, WordmarkVariantImg);

const LogoTitle = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
  marginHorizontal: theme.sizing.baseUnit,
  height: 24,
  alignSelf: 'center',
  resizeMode: 'contain',
  width: '50%',
}))(Image);

const HeaderSpacer = styled(({ theme }) => ({
  ...Platform.select({
    ios: {
      height: HEADER_OFFSET - theme.sizing.baseUnit,
    },
    android: {
      height: 0,
    },
  }),
}))(View);

const Wordmark = () => {
  const source = useDynamicValue(DynamicWordmark);

  return <LogoTitle source={source} />;
};

export const COLOR_MAP = ['primary', 'success', 'alert', 'warning'];

const Home = ({ navigation }) => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const renderItem = ({ item }) => (
    <ActionMapper
      titleColor={COLOR_MAP[item.colorIndex]}
      navigation={navigation}
      {...item}
    />
  );
  const setNavigationParam = (params) => {
    navigation.setParams(params);
  };

  useEffect(() => setNavigationParam({ scrollY }), []);

  return (
    <BackgroundView>
      <SafeAreaView forceInset={{ bottom: 'never', top: 'always' }}>
        <StatusBar />
        <Query
          query={GET_FEED_FEATURES}
          variables={{
            first: 10,
            after: null,
          }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data, refetch, fetchMore, variables }) => (
            <FeedView
              content={get(data, 'userFeedFeatures', []).map((n, i) => ({
                ...n,
                colorIndex: i % COLOR_MAP.length,
              }))}
              fetchMore={fetchMoreResolver({
                collectionName: 'userFeedFeatures',
                fetchMore,
                variables,
                data,
              })}
              isLoading={loading}
              error={error}
              refetch={refetch}
              ListHeaderComponent={
                <View>
                  <NavigationSpacer />
                  <LiveButton key="HomeFeedLiveButton" />
                </View>
              }
              renderItem={renderItem}
              scrollEventThrottle={16}
              onScroll={Animated.event([
                {
                  nativeEvent: {
                    contentOffset: { y: scrollY },
                  },
                },
              ])}
            />
          )}
        </Query>
      </SafeAreaView>
    </BackgroundView>
  );
};

Home.navigationOptions = ({ navigation, theme }) => ({
  ...navigationOptions,
  headerTitleStyle: {
    ...navigationOptions.headerTitleStyle,
    color: theme === 'dark' ? 'white' : 'black',
  },
  headerBackground: (
    <NavigationBackground
      scrollY={get(navigation, 'state.params.scrollY', new Animated.Value(0))}
    />
  ),
  headerTitle: <Wordmark />,
  title: 'Home',
});

Home.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Home;
