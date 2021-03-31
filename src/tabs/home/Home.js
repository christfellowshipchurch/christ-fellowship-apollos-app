import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import { styled, BackgroundView, Button } from '@apollosproject/ui-kit';

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

const Home = () => {
  const { data, error, loading } = useQuery(GET_HOME_FEED, {
    fetchPolicy: 'cache-and-network',
  });
  const featuresFeedId = data?.homeFeedFeatures?.id;
  const headerFeatures = data?.homeHeaderFeedFeatures?.features;
  const navigation = useNavigation();

  return (
    <BackgroundView>
      <Button
        title="Chat"
        onPress={() =>
          navigation.navigate('ChatChannelSingle', {
            itemId:
              'StreamChatChannel:b535c7f03919d0d7bed9c6a0e69a83b20afea48a82973a92db54ef340d096a4dfe08b9b9c184b2c7260c1e7f944fc02d6f27ffe7f093c6e9e85bfa5bc89e4480062a91613770697acb80fb47fa6c1bb5',
          })
        }
      />
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
