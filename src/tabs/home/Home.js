import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { Image } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  styled,
  FeedView,
  BackgroundView,
  H3,
  H6,
  TouchableScale,
} from '@apollosproject/ui-kit';

import fetchMoreResolver from '../../utils/fetchMoreResolver';
import ContentCardConnected from '../../ui/ContentCardConnected';

import { LiveButton } from '../../live';

import ContentTableCard from '../../ui/ContentTableCard';
import GET_USER_FEED from './getUserFeed';
import GET_PERSONA_FEED from './getPersonaFeed';
import GET_CAMPAIGN_CONTENT_ITEM from './getCampaignContentItem';

const LogoTitle = styled(({ theme }) => ({
  height: theme.sizing.baseUnit,
  margin: theme.sizing.baseUnit,
  alignSelf: 'center',
  resizeMode: 'contain',
}))(Image);

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6);

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
  };

  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      transitionKey: item.transitionKey,
    });

  render() {
    return (
      <BackgroundView>
        <SafeAreaView>
          <Query
            query={GET_USER_FEED}
            variables={{
              first: 10,
              after: null,
            }}
            fetchPolicy="cache-and-network"
          >
            {({ loading, error, data, refetch, fetchMore, variables }) => (
              <FeedView
                ListItemComponent={ContentCardConnected}
                content={get(data, 'userFeed.edges', []).map(
                  (edge) => edge.node
                )}
                fetchMore={fetchMoreResolver({
                  collectionName: 'userFeed',
                  fetchMore,
                  variables,
                  data,
                })}
                isLoading={loading}
                error={error}
                refetch={refetch}
                ListHeaderComponent={
                  <>
                    <LogoTitle source={require('./wordmark.png')} />
                    <LiveButton />
                    <Query
                      query={GET_CAMPAIGN_CONTENT_ITEM}
                      fetchPolicy="cache-and-network"
                    >
                      {({ data: featuredData, loading: isFeaturedLoading }) => {
                        const featuredContent = get(
                          featuredData,
                          'campaigns.edges',
                          []
                        ).map((edge) => edge.node);

                        const featuredItem = get(
                          featuredContent[0],
                          'childContentItemsConnection.edges[0].node',
                          {}
                        );

                        return (
                          <TouchableScale
                            onPress={() =>
                              this.handleOnPress({ id: featuredItem.id })
                            }
                          >
                            <ContentCardConnected
                              contentId={featuredItem.id}
                              isLoading={isFeaturedLoading}
                            />
                          </TouchableScale>
                        );
                      }}
                    </Query>
                    <Query
                      query={GET_PERSONA_FEED}
                      fetchPolicy="cache-and-network"
                    >
                      {({
                        data: personaData,
                        loading: isContentTableLoading,
                      }) => (
                        <ContentTableCard
                          isLoading={isContentTableLoading}
                          onPress={this.handleOnPress}
                          header={
                            <>
                              <StyledH6 isLoading={isContentTableLoading}>
                                FOR YOU
                              </StyledH6>
                              <H3
                                isLoading={isContentTableLoading}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                              >
                                Explore what God calls you to today
                              </H3>
                            </>
                          }
                          content={get(
                            personaData,
                            'personaFeed.edges',
                            []
                          ).map((edge) => edge.node)}
                        />
                      )}
                    </Query>
                  </>
                }
                onPressItem={this.handleOnPress}
              />
            )}
          </Query>
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

export default Home;
