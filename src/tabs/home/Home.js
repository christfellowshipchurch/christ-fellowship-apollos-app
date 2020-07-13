import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { get, flatten } from 'lodash';
import PropTypes from 'prop-types';

import { FeaturesHeaderConnected } from 'features';

import { FeedView, DefaultCard } from '@apollosproject/ui-kit';

import StatusBar from 'ui/StatusBar';

import { HorizontalDivider } from 'ui/Dividers';
import Wordmark from 'ui/Wordmark';
import { HighlightCard } from 'ui/Cards';
import { Feature } from '../../feature';
import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../../navigation';
import LiveStreamsFeed from './LiveStreamsFeed';

import GET_FEED_FEATURES from './getFeedFeatures';

const mapDataToActions = (data) => flatten(data.map(({ actions }) => actions));

const Home = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_FEED_FEATURES, {
    fetchPolicy: 'cache-and-network',
  });
  const { scrollY } = useHeaderScrollEffect({ navigation });
  const content = mapDataToActions(get(data, 'userFeedFeatures', []));
  const renderItem = ({ item }) => {
    if (item.isLoading)
      return (
        <>
          <HighlightCard title="" isLoading coverImage={[]} />
          <HorizontalDivider />
        </>
      );

    return item.action ? (
      <>
        <Feature {...item} isLoading={loading} />
        <HorizontalDivider />
      </>
    ) : null;
  };

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
          ListHeaderComponent={
            <React.Fragment>
              <NavigationSpacer />
              <FeaturesHeaderConnected />
            </React.Fragment>
          }
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

Home.navigationOptions = (props) =>
  navigationOptions({
    ...props,
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
