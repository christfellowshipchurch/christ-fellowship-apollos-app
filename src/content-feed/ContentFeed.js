import React, { useState } from 'react';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { withProps } from 'recompose';

import {
  BackgroundView,
  FeedView,
  withMediaQuery,
  TouchableScale,
} from '@apollosproject/ui-kit';

import ActionRow from '../ui/ActionRow';
import ContentCardConnected from '../ui/ContentCardConnected';
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

const FeedWithMediaQuery = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps({ numColumns: 1 }),
  withProps({ numColumns: 2 })
)(FeedView);

const renderItem = ({ item, onPress, Component }) => (
  <TouchableScale onPress={() => onPress(item)} style={{ flex: 1 }}>
    <Component {...item} />
  </TouchableScale>
);

/**
 * This is where the component description lives
 * A FeedView wrapped in a query to pull content data.
 */
const ContentFeed = ({ navigation, Component, card }) => {
  const itemId = navigation.getParam('itemId', []);
  const { loading, error, data, refetch } = useQuery(GET_CONTENT_FEED, {
    fetchPolicy: 'cache-and-network',
    variables: {
      itemId,
    },
  });
  const { scrollY } = useHeaderScrollEffect({ navigation });
  /** Function that is called when a card in the feed is pressed.
   * Takes the user to the ContentSingle
   */
  const onPress = (item) => {
    navigation.navigate('ContentSingle', {
      itemId: item.id,
      sharing: item.sharing,
    });
  };

  const ContentCard = ({ id, ...props }) => (
    <ContentCardConnected card={card} {...props} contentId={id} />
  );

  return (
    <BackgroundView>
      <SafeAreaView>
        <FeedWithMediaQuery
          renderItem={(props) =>
            renderItem({
              ...props,
              Component: Component || ContentCard,
              onPress,
            })
          }
          content={mapData(data)}
          isLoading={loading}
          error={error}
          // onPressItem={handleOnPress}
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
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  card: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

ContentFeed.defaultProps = {
  Component: null,
  card: ActionRow,
};

export default ContentFeed;
