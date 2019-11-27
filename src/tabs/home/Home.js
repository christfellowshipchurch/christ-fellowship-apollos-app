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
} from '@apollosproject/ui-kit';

import fetchMoreResolver from '../../utils/fetchMoreResolver';
import ActionMapper from './ActionMapper'

import { LiveButton } from '../../live';

import GET_FEED_FEATURES from './getFeedFeatures';

const LogoTitle = styled(({ theme }) => ({
  height: theme.sizing.baseUnit,
  margin: theme.sizing.baseUnit,
  alignSelf: 'center',
  resizeMode: 'contain',
  width: '50%'
}))(Image);

export const COLOR_MAP = [
  'primary', 'success', 'alert', 'warning'
]

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
    colorIndex: PropTypes.number
  };

  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      transitionKey: item.transitionKey,
    });

  renderItem = ({ item }) => {
    return <ActionMapper
      titleColor={COLOR_MAP[item.colorIndex]}
      navigation={this.props.navigation}
      {...item}
    />
  }

  render() {
    return (
      <BackgroundView>
        <SafeAreaView>
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
                content={get(data, 'userFeedFeatures', [])
                  .map((n, i) => ({ ...n, colorIndex: i % COLOR_MAP.length }))}
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
                  <View
                    style={{ backgroundColor: 'white', }}
                  >
                    {/* <LiveButton
                      key="HomeFeedLiveButton"
                    /> */}
                    <LogoTitle source={require('./wordmark.png')} />
                  </View>
                }
                stickyHeaderIndices={[0]}
                renderItem={this.renderItem}
              />
            )
            }
          </Query>
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

export default Home;
