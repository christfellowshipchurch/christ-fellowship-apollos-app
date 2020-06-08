import React, { useEffect } from 'react';
import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import moment from 'moment';
import { withNavigation, SafeAreaView } from 'react-navigation';

import { CardFeed } from 'ui/CardFeeds';
import StatusBar from 'ui/StatusBar';

import {
  HEADER_OFFSET,
  navigationOptions,
  BackgroundView,
  useHeaderScrollEffect,
} from '../../navigation';
import { GET_EVENTS } from './queries';

// Events Component (default export)
const Events = ({ navigation }) => {
  const { scrollY } = useHeaderScrollEffect({ navigation });
  const { loading, error, data, refetch } = useQuery(GET_EVENTS, {
    fetchPolicy: 'cache-and-network',
  });

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
        <StatusBar />
        <CardFeed
          ListFooterComponent={<View style={{ height: HEADER_OFFSET }} />}
          style={{
            paddingTop: HEADER_OFFSET,
          }}
          content={allEventsSorted}
          isLoading={loading}
          error={error}
          refetch={refetch}
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

Events.defaultProps = {};

Events.navigationOptions = (props) =>
  navigationOptions({ ...props, title: 'Events' });

export default withNavigation(Events);
