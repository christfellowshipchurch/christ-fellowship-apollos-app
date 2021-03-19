import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';

import { View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ErrorCard,
  BackgroundView,
  PaddedView,
  styled,
  StretchyView,
} from '@apollosproject/ui-kit';
import NavigationHeader from 'ui/NavigationHeader';

import GET_PRAYER_REQUEST from './getPrayerRequest';

import PrayerRequestText from './PrayerRequestText';
import RequestedDate from './RequestedDate';
import RequestorAvatar from './RequestorAvatar';

const Spacer = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(View);

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const PrayerRequestSingle = (props) => {
  const prayerRequestId = props.route?.params?.itemId;
  const { loading, error, data } = useQuery(GET_PRAYER_REQUEST, {
    fetchPolicy: 'cache-and-network',
    skip: !prayerRequestId,
    variables: {
      prayerRequestId,
    },
  });

  if (error)
    return (
      <BackgroundView>
        <SafeAreaView forceInset>
          <ErrorCard error={error} />
        </SafeAreaView>
      </BackgroundView>
    );

  const prayer = get(data, 'node', {});
  const isLoading = loading && !prayer.id;

  return (
    <BackgroundView>
      <NavigationHeader />
      <StretchyView>
        {({ Stretchy, ...scrollViewProps }) => (
          <FlexedScrollView {...scrollViewProps}>
            <Spacer>
              <RequestorAvatar
                prayerRequestId={prayer.id}
                isLoading={isLoading}
                StretchyComponent={Stretchy}
              />
            </Spacer>
            <PaddedView>
              <RequestedDate
                prayerRequestId={prayer.id}
                isLoading={isLoading}
              />
            </PaddedView>
            <PaddedView>
              <PrayerRequestText
                prayerRequestId={prayer.id}
                isLoading={isLoading}
              />
            </PaddedView>
          </FlexedScrollView>
        )}
      </StretchyView>
    </BackgroundView>
  );
};

PrayerRequestSingle.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      prayerRequestId: PropTypes.string,
    }),
  }),
};

export default PrayerRequestSingle;
