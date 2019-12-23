import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  styled,
  FeedView,
  BackgroundView,
  TouchableScale,
  FeaturedCard,
} from '@apollosproject/ui-kit';

import { useDarkMode } from 'react-native-dark-mode';
import { LiveButton } from '../../live';

import fetchMoreResolver from '../../utils/fetchMoreResolver';
import ContentCardConnected from '../../ui/ContentCardConnected';

import ActionMapper from './ActionMapper';
import Features from './Features';
import GET_USER_FEED from './getUserFeed';
import GET_CAMPAIGN_CONTENT_ITEM from './getCampaignContentItem';
import GET_FEED_FEATURES from './getFeedFeatures';

import WordmarkImg from './wordmark.png';
import WordmarkVariantImg from './wordmark_variant.png';

const LogoTitle = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
  height: theme.sizing.baseUnit,
  alignSelf: 'center',
  resizeMode: 'contain',
  width: '50%',
}))(Image);

const Wordmark = () => {
  const isDarkMode = useDarkMode();

  return <LogoTitle source={isDarkMode ? WordmarkVariantImg : WordmarkImg} />;
};

export const COLOR_MAP = ['primary', 'success', 'alert', 'warning'];

class Home extends PureComponent {
  static navigationOptions = () => ({
    header: null,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      setParams: PropTypes.func,
      navigate: PropTypes.func,
    }),
    colorIndex: PropTypes.number,
  };

  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      transitionKey: item.transitionKey,
    });

  renderItem = ({ item }) => (
    <ActionMapper
      titleColor={COLOR_MAP[item.colorIndex]}
      navigation={this.props.navigation}
      {...item}
    />
  );

  render() {
    return (
      <BackgroundView>
        <SafeAreaView forceInset={{ bottom: 'never', top: 'always' }}>
          <Query
            query={GET_FEED_FEATURES}
            variables={{
              first: 10,
              after: null,
            }}
            fetchPolicy="cache-and-network"
          >
            {({ loading, error, data, refetch, fetchMore, variables }) => (
              <FeedView
                content={get(data, 'userFeedFeatures', []).map((n, i) => ({
                  ...n,
                  colorIndex: i % COLOR_MAP.length,
                }))}
                fetchMore={fetchMoreResolver({
                  collectionName: 'userFeedFeatures',
                  fetchMore,
                  variables,
                  data,
                })}
                isLoading={loading}
                error={error}
                refetch={refetch}
                ListHeaderComponent={
                  <SafeAreaView forceInset={{ bottom: 'never', top: 'never' }}>
                    <LiveButton key="HomeFeedLiveButton" />
                    <Wordmark />
                  </SafeAreaView>
                }
                // stickyHeaderIndices={[0]}
                renderItem={this.renderItem}
              />
            )}
          </Query>
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

export default Home;
