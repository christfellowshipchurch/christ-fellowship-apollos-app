import React from 'react';
import { View, Animated } from 'react-native';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';
import { SafeAreaView } from 'react-navigation';

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

const PrayerRequestSingle = ({ navigation }) => {
  const prayerRequestId = navigation.getParam('prayerRequestId', null);
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

  return (
    <BackgroundView>
      <StretchyView>
        {({ Stretchy, ...scrollViewProps }) => (
          <FlexedScrollView {...scrollViewProps}>
            <Spacer>
              <RequestorAvatar
                prayerRequestId={prayer.id}
                isLoading={loading}
                StretchyComponent={Stretchy}
              />
            </Spacer>
            <PaddedView>
              <RequestedDate prayerRequestId={prayer.id} isLoading={loading} />
            </PaddedView>
            <PaddedView>
              <PrayerRequestText
                prayerRequestId={prayer.id}
                isLoading={loading}
              />
            </PaddedView>
          </FlexedScrollView>
        )}
      </StretchyView>
    </BackgroundView>
  );
};

PrayerRequestSingle.propTypes = {};

PrayerRequestSingle.navigationOptions = {
  header: NavigationHeader,
  headerTransparent: true,
  headerMode: 'float',
};

export default PrayerRequestSingle;
