import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import {
  styled,
  BackgroundView,
  ThemeMixin,
  Button,
} from '@apollosproject/ui-kit';

import {
  FeaturesFeedConnected,
  HorizontalFeaturesFeedConnected,
} from 'features';

import TabHeader from '../TabHeader';

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
  const navigation = useNavigation();

  const { data, error, loading } = useQuery(GET_HOME_FEED, {
    fetchPolicy: 'cache-and-network',
  });
  const featuresFeedId = data?.homeFeedFeatures?.id;
  const headerFeaturesFeedId = data?.homeHeaderFeedFeatures?.id;

  return (
    <ThemeMixin>
      <BackgroundView>
        <TabHeader />
        <Button
          title="Go"
          onPress={() =>
            navigation.navigate('ContentSingle', {
              itemId: 'MediaContentItem:19fdfd99cefa3c767d658b865729e178',
            })
          }
        />
        <FeaturesFeedConnected
          featuresFeedId={featuresFeedId}
          isLoading={loading}
          error={error}
          ListHeaderComponent={
            <ListHeaderSpacer>
              <HorizontalFeaturesFeedConnected
                featuresFeedId={headerFeaturesFeedId}
              />
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
