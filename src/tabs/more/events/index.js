import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import moment from 'moment';
import { withNavigation } from 'react-navigation';

import { View } from 'react-native';
import { BackgroundView, FeedView } from '@apollosproject/ui-kit';

import { RowFeedHeaderComponent } from '../../../content-feed/RowFeed';
import { TileRowCard } from '../../../ui/Cards';
import ContentCardConnected from '../../../ui/ContentCardConnected';

import { GET_EVENTS } from './queries';

const EventContentItemRow = ({ id }) => (
  <ContentCardConnected card={TileRowCard} contentId={id} />
);

const Events = ({ title, navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_EVENTS, {
    fetchPolicy: 'cache-and-network',
  });

  /** Function that is called when a card in the feed is pressed.
   * Takes the user to the ContentSingle
   */
  const handleOnPress = (item) => {
    navigation.navigate('ContentSingle', {
      itemId: item.id,
      sharing: item.sharing,
    });
  };

  const sortedEvents = get(data, 'allEvents', []).sort((a, b) =>
    moment(a.nextOccurrence).diff(b.nextOccurrence)
  );

  return (
    <BackgroundView style={{ flex: 1 }}>
      <RowFeedHeaderComponent navigation={navigation} title={title} />

      <View style={{ flex: 10 }}>
        <FeedView
          ListItemComponent={EventContentItemRow}
          content={sortedEvents}
          isLoading={loading}
          error={error}
          refetch={refetch}
          onPressItem={handleOnPress}
        />
      </View>
    </BackgroundView>
  );
};

Events.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.any,
};

Events.defaultProps = {
  title: 'Events',
};

Events.navigationOptions = {
  header: null,
};

export default withNavigation(Events);
