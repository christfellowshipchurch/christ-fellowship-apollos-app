import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import {
  styled,
  BackgroundView,
  Button,
  ThemeMixin,
} from '@apollosproject/ui-kit';

import {
  FeaturesFeedConnected,
  HorizontalFeaturesFeedConnected,
} from 'features';

const ListHeaderSpacer = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(View);

export const GET_HOME_FEED = gql`
  query getHomeFeatureFeed {
    homeFeedFeatures {
      id
    }

    homeHeaderFeedFeatures {
      id
      features {
        id
      }
    }
  }
`;

// todo : used for testing. remove this before go-live
const ChannelListButton = () => {
  const navigation = useNavigation();

  const onPress = () => navigation.navigate('ChatChannelList');

  return <Button title="Chat Button" onPress={onPress} />;
};

const Home = () => {
  const { data, error, loading } = useQuery(GET_HOME_FEED, {
    fetchPolicy: 'cache-and-network',
  });
  const featuresFeedId = data?.homeFeedFeatures?.id;
  const headerFeatures = data?.homeHeaderFeedFeatures?.features;

  return (
    <ThemeMixin>
      <BackgroundView>
        <FeaturesFeedConnected
          featuresFeedId={featuresFeedId}
          isLoading={loading}
          error={error}
          ListHeaderComponent={
            <ListHeaderSpacer>
              <HorizontalFeaturesFeedConnected features={headerFeatures} />
            </ListHeaderSpacer>
          }
          removeClippedSubviews={false}
          numColumns={1}
        />
      </BackgroundView>
    </ThemeMixin>
  );
};

Home.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Home;
