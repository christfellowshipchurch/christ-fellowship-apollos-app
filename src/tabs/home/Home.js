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
} from '@apollosproject/ui-kit';
import ContentCardConnected from '../../ui/ContentCardConnected';

import { LiveButton } from '../../live';

import ContentTableCard from '../../ui/ContentTableCard';
import getUserFeed from './getUserFeed';
import getPersonaFeed from './getPersonaFeed';

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
          <Query query={getUserFeed} fetchPolicy="cache-and-network">
            {({ loading, error, data, refetch }) => (
              <FeedView
                ListItemComponent={ContentCardConnected}
                content={get(data, 'userFeed.edges', []).map(
                  (edge) => edge.node
                )}
                isLoading={loading}
                error={error}
                refetch={refetch}
                ListHeaderComponent={
                  <>
                    <LogoTitle source={require('./wordmark.png')} />
                    <LiveButton />
                    <Query
                      query={getPersonaFeed}
                      fetchPolicy="cache-and-network"
                    >
                      {({ data: personaData, loading: actionLoading }) => (
                        <ContentTableCard
                          isLoading={actionLoading}
                          onPress={this.handleOnPress}
                          header={
                            <>
                              <StyledH6 isLoading={actionLoading}>
                                FOR YOU
                              </StyledH6>
                              <H3
                                isLoading={actionLoading}
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
