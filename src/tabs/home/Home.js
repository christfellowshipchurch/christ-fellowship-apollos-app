<<<<<<< Updated upstream
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Animated } from 'react-native';
=======
import React, { useState, useEffect } from 'react';
import { Animated, View } from 'react-native';
>>>>>>> Stashed changes
import { SafeAreaView } from 'react-navigation';
import { get, flatten } from 'lodash';
import PropTypes from 'prop-types';
<<<<<<< Updated upstream
=======
import { get } from 'lodash';
>>>>>>> Stashed changes

import { FeedView, DefaultCard } from '@apollosproject/ui-kit';

import StatusBar from 'ui/StatusBar';

<<<<<<< Updated upstream
import { HorizontalDivider } from 'ui/Dividers';
import Wordmark from 'ui/Wordmark';
import { HighlightCard } from 'ui/Cards';
import { Feature } from '../../feature';
=======
import Wordmark from 'ui/Wordmark';
>>>>>>> Stashed changes
import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../../navigation';
import LiveStreamsFeed from './LiveStreamsFeed';

<<<<<<< Updated upstream
import GET_FEED_FEATURES from './getFeedFeatures';

const mapDataToActions = (data) => flatten(data.map(({ actions }) => actions));

const Home = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_FEED_FEATURES, {
    fetchPolicy: 'cache-and-network',
  });
=======
const ListHeaderSpacer = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(View);

const Home = ({ navigation }) => {
  const [refetchRef, setRefetchRef] = useState(null);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
              <LiveStreamsFeed />
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
=======
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <SafeAreaView>
            <FeaturesFeedConnected
              onPressActionItem={handleOnPress({ openUrl })}
              showDebug
              ListHeaderComponent={
                <ListHeaderSpacer>
                  <NavigationSpacer />
                  <FeaturesHeaderConnected
                    refetchRef={get(refetchRef, 'refetchRef', () => null)}
                    refetchId="HomeFeedFeaturesHeaderConnected"
                  />
                </ListHeaderSpacer>
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
              onRef={(ref) => setRefetchRef(ref)}
            />
          </SafeAreaView>
        </BackgroundView>
      )}
    </RockAuthedWebBrowser>
>>>>>>> Stashed changes
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
