import React from 'react';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { BackgroundView } from '@apollosproject/ui-kit';

import { CardFeed } from 'ui/CardFeeds';
import ActionRow from 'ui/ActionRow';
import {
  navigationOptions,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../navigation';

import GET_CONTENT_FEED from './getContentFeed';

const mapData = (data) =>
  get(data, 'node.childContentItemsConnection.edges', []).map(({ node }) => ({
    ...node,
    coverImage: get(node, 'coverImage.sources', []),
    label: get(node, 'tags[0]'),
  }));

/**
 * This is where the component description lives
 * A FeedView wrapped in a query to pull content data.
 */
const ContentFeed = ({ navigation, card }) => {
  const itemId = navigation.getParam('itemId', []);
  const { loading, error, data, refetch } = useQuery(GET_CONTENT_FEED, {
    fetchPolicy: 'cache-and-network',
    variables: {
      itemId,
    },
  });
  const { scrollY } = useHeaderScrollEffect({ navigation });

  return (
    <BackgroundView>
      <SafeAreaView>
        <CardFeed
          card={card}
          content={mapData(data)}
          isLoading={loading}
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
        />
      </SafeAreaView>
    </BackgroundView>
  );
};

ContentFeed.navigationOptions = ({ navigation, ...props }) =>
  navigationOptions({
    navigation,
    ...props,
    title: navigation.getParam('itemTitle', 'Content Channel'),
  });

ContentFeed.propTypes = {
  /** Functions passed down from React Navigation to use in navigating to/from
   * items in the feed.
   */
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  card: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

ContentFeed.defaultProps = {
  card: ActionRow,
};

export default ContentFeed;
