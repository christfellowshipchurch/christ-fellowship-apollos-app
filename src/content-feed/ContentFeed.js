import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { get, isEmpty } from 'lodash';

import { BackgroundView } from '@apollosproject/ui-kit';

import { CardFeed } from 'ui/CardFeeds';
import ActionRow from 'ui/ActionRow';

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
const ContentFeed = ({ navigation, card, route }) => {
  const itemId = route.params?.itemId;
  const skip = !itemId || isEmpty(itemId);
  const { loading, error, data, refetch } = useQuery(GET_CONTENT_FEED, {
    fetchPolicy: 'cache-and-network',
    variables: {
      itemId,
    },
    skip,
  });

  return (
    <BackgroundView>
      <CardFeed
        navigation={navigation}
        CardComponent={card}
        content={mapData(data)}
        isLoading={loading}
        error={error}
        refetch={refetch}
      />
    </BackgroundView>
  );
};

ContentFeed.propTypes = {
  /** Functions passed down from React Navigation to use in navigating to/from
   * items in the feed.
   */
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  card: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  route: PropTypes.shape({
    params: PropTypes.shape({
      itemId: PropTypes.string,
    }),
  }),
};

ContentFeed.defaultProps = {
  card: ActionRow,
};

export default ContentFeed;
