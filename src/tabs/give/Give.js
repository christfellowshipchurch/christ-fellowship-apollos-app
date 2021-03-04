import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { styled, BackgroundView } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

import { FeaturesFeedConnected, handleActionPress } from 'features';

// getHomeFeed uses the HOME_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
export const GET_GIVE_FEED = gql`
  query getGiveFeedFeatures {
    giveFeedFeatures {
      id
    }
  }
`;

const FlexedSafeAreaView = styled(() => ({ flex: 1 }))(SafeAreaView);

const Give = () => {
  const { data } = useQuery(GET_GIVE_FEED, {
    fetchPolicy: 'cache-and-network',
  });
  const [refetchRef, setRefetchRef] = useState(null);

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <FlexedSafeAreaView>
            <FeaturesFeedConnected
              featureFeedId={data?.giveFeedFeatures?.id}
              openUrl={openUrl}
              onPressActionItem={handleActionPress}
              removeClippedSubviews={false}
              numColumns={1}
              onRef={(ref) => setRefetchRef(ref)}
            />
          </FlexedSafeAreaView>
        </BackgroundView>
      )}
    </RockAuthedWebBrowser>
  );
};

Give.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Give;
