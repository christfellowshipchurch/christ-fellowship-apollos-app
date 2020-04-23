import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Image, Animated, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { get, flatten } from 'lodash';
import PropTypes from 'prop-types';

import { styled, FeedView, withMediaQuery } from '@apollosproject/ui-kit';
import { withProps } from 'recompose';

import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';
import {
  navigationOptions,
  BackgroundView,
  NavigationBackground,
  NavigationSpacer,
} from '../navigation';
import StatusBar from '../../ui/StatusBar';

import { Feature } from '../../feature';
import { HorizontalDivider } from '../../ui/Dividers';

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

const Wordmark = () => {
  const source = useDynamicValue(DynamicWordmark);

  return <LogoTitle source={source} />;
};

const FeedWithMediaQuery = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps({ numColumns: 1 }),
  withProps({ numColumns: 2 })
)(FeedView);

const mapDataToActions = (data) => flatten(data.map(({ actions }) => actions));

const renderItem = ({ item }) =>
  item.action ? (
    <>
      <Feature {...item} />
      <HorizontalDivider />
    </>
  ) : null;

const Home = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_FEED_FEATURES, {
    fetchPolicy: 'cache-and-network',
  });
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const setNavigationParam = (params) => {
    navigation.setParams(params);
  };

  useEffect(() => setNavigationParam({ scrollY }), []);
  const content = mapDataToActions(get(data, 'userFeedFeatures', []));

  return (
    <BackgroundView>
      <SafeAreaView forceInset={{ bottom: 'never', top: 'always' }}>
        <StatusBar />
        <FeedView
          renderItem={renderItem}
          content={content}
          isLoading={loading && !get(data, 'userFeedFeatures', []).length}
          error={error}
          refetch={refetch}
          ListHeaderComponent={<NavigationSpacer />}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ])}
          removeClippedSubviews={false}
          numColumns={1}
        />
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
