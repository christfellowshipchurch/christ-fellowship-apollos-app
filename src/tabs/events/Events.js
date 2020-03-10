import React, { useState, useEffect } from 'react';
import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import moment from 'moment';
import { withNavigation, SafeAreaView } from 'react-navigation';

import { FeedView, H3, TouchableScale, styled } from '@apollosproject/ui-kit';

import { TileRowCard } from 'ChristFellowship/src/ui/Cards';
import ContentCardConnected from 'ChristFellowship/src/ui/ContentCardConnected';

import {
  HEADER_OFFSET,
  navigationOptions,
  BackgroundView,
  BlurView,
} from '../navigation';
import { GET_EVENTS } from './queries';

const EventContentItemRow = ({ id }) => (
  <ContentCardConnected card={TileRowCard} contentId={id} />
);

// Event Collection Component
const SectionTitle = styled(({ theme, color }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  marginTop: theme.sizing.baseUnit * 1.5,
  color: theme.colors[color],
}))(H3);

const EventCollection = ({ title, events, onPress, isLoading, color }) => (
  <View>
    <SectionTitle isLoading={isLoading} color={color}>
      {title}
    </SectionTitle>
    {events.map(({ id }) => (
      <TouchableScale key={id} onPress={() => onPress({ id })}>
        <EventContentItemRow id={id} />
      </TouchableScale>
    ))}
  </View>
);

EventCollection.defaultProps = {
  events: [],
};

EventCollection.propTypes = {
  title: PropTypes.string,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  onPress: PropTypes.func,
};

// Events Component (default export)
const Events = ({ navigation }) => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
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

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item, isLoading }) => (
    <EventCollection {...item} onPress={handleOnPress} isLoading={isLoading} />
  );

  const setNavigationParam = (params) => {
    navigation.setParams(params);
  };

  useEffect(() => setNavigationParam({ scrollY }), []);

  const allEventsSorted = get(data, 'allEvents', []).sort(
    (a, b) =>
      b.events.length - a.events.length ||
      moment(a.nextOccurrence).diff(b.nextOccurrence)
  );

  return (
    <BackgroundView>
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ bottom: 'never', top: 'always' }}
      >
        <FeedView
          ListFooterComponent={<View style={{ height: HEADER_OFFSET }} />}
          style={{
            paddingTop: HEADER_OFFSET,
          }}
          content={[
            {
              title: 'Featured Events',
              events: get(data, 'featuredEvents.edges', []).map(
                ({ node }) => node
              ),
              color: 'primary',
            },
            {
              title: 'All Events and Opportunities',             
              events: allEventsSorted,
              color: 'warning',
            },
          ]}
          isLoading={loading}
          error={error}
          refetch={refetch}
          onPressItem={renderItem}
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
      </SafeAreaView>
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

Events.navigationOptions = ({ navigation, theme }) => ({
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
  title: 'Events',
});

export default withNavigation(Events);
