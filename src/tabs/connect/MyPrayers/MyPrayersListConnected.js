import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

import { TouchableScale } from '@apollosproject/ui-kit';
import { CardFeed } from 'ui/CardFeeds';
import { HorizontalPrayerRequestCard } from 'ui/Cards';
import { GET_MY_PRAYERS } from './queries';

const loadingStateObject = {
  id: 'fake_id',
  text: '',
  date: moment().format(),
};

const mapEdges = (data) =>
  get(data, 'currentUserPrayerRequests.edges', []).map(({ node }) => ({
    ...node,
    date: node.requestedDate,
  }));

const MyPrayersListConnected = ({ onSeeMore, onPressItem }) => {
  const { loading, error, data } = useQuery(GET_MY_PRAYERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      first: 5,
      after: null,
    },
  });

  const renderItem = ({ item }) => (
    <TouchableScale onPress={() => onPressItem(item)}>
      <HorizontalPrayerRequestCard {...item} isLoading={loading} />
    </TouchableScale>
  );

  const prayers = mapEdges(data);

  return (
    <CardFeed
      content={prayers.sort((a, b) =>
        moment(b.requestedDate).diff(a.requestedDate)
      )}
      renderItem={renderItem}
      loadingStateObject={loadingStateObject}
      isLoading={loading && prayers.length === 0}
      error={error}
      cardWidth={HorizontalPrayerRequestCard.cardWidth}
      seeMore
      title="My Prayers"
      horizontal
      onPressHeader={onSeeMore}
    />
  );
};

MyPrayersListConnected.propTypes = {
  onSeeMore: PropTypes.func,
  onPressItem: PropTypes.func,
};

export default MyPrayersListConnected;
