import React from 'react';
import PropTypes from 'prop-types';
import { Animated, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { get } from 'lodash';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

import { fetchMoreResolver } from '@apollosproject/ui-connected';
import { styled, H4, PaddedView, TouchableScale } from '@apollosproject/ui-kit';

import { CardFeed } from 'ui/CardFeeds';
import DateLabel from 'ui/DateLabel';
import { HorizontalDivider } from 'ui/Dividers';
import {
  navigationOptions,
  NavigationSpacer,
  useHeaderScrollEffect,
} from 'navigation';
import { GET_MY_PRAYERS } from './queries';

const loadingStateObject = {
  id: 'fake_id',
  text: '',
  date: moment().format(),
};

const PrayerPreview = ({ text, date, isLoading }) => (
  <PaddedView>
    <DateLabel date={date} isLoading={isLoading} />
    <H4 isLoading={isLoading} numberOfLines={3}>
      {text}
    </H4>
  </PaddedView>
);

const StyledHorizontalDivider = styled(({ theme }) => ({
  width: '100%',
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(HorizontalDivider);

const mapEdges = (data) =>
  get(data, 'currentUserPrayerRequests.edges', []).map(({ node }) => ({
    ...node,
    date: node.requestedDate,
  }));

const MyPrayersFeed = ({ navigation }) => {
  const { scrollY } = useHeaderScrollEffect({ navigation });
  const { loading, error, data, refetch, fetchMore, variables } = useQuery(
    GET_MY_PRAYERS,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        first: 10,
        after: null,
      },
    }
  );

  const prayers = mapEdges(data);
  const renderItem = ({ item }) => (
    <TouchableScale
      onPress={() =>
        navigation.navigate('PrayerRequestSingle', { prayerRequestId: item.id })
      }
    >
      <PrayerPreview {...item} />
    </TouchableScale>
  );

  return (
    <SafeAreaView
      forceInset={{ top: 'always', bottom: 'never' }}
      style={{ flex: 1 }}
    >
      <CardFeed
        ListHeaderComponent={<NavigationSpacer />}
        ItemSeparatorComponent={StyledHorizontalDivider}
        content={prayers.sort((a, b) =>
          moment(b.requestedDate).diff(a.requestedDate)
        )}
        renderItem={renderItem}
        loadingStateObject={loadingStateObject}
        isLoading={loading}
        error={error}
        fetchMore={fetchMoreResolver({
          collectionName: 'currentUserPrayerRequests',
          fetchMore,
          variables,
          data,
        })}
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
  );
};

MyPrayersFeed.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    title: 'My Prayers',
  });

MyPrayersFeed.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default MyPrayersFeed;
