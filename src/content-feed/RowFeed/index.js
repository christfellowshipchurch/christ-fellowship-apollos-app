import React, { PureComponent } from 'react';
import { SafeAreaView } from 'react-navigation';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  BackgroundView,
  FeedView,
  FlexedView,
  H3,
  styled,
  withTheme,
  Touchable,
} from '@apollosproject/ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { TileRowCard } from '../../ui/Cards';
import fetchMoreResolver from '../../utils/fetchMoreResolver';

import GET_CONTENT_FEED from '../getContentFeed';

const HeaderTitle = styled(() => ({
  flex: 4,
  textAlign: 'center',
}))(H3);

const HeaderIconContainer = styled(() => ({
  flex: 1,
}))(Touchable);

const HeaderContainer = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 4,
  paddingHorizontal: theme.sizing.baseUnit,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
}))(FlexedView);

const BackIcon = withTheme(({ theme }) => ({
  color: theme.colors.darkSecondary,
  icon: ['fal', 'angle-left'],
  size: 42,
  style: {
    flex: 1,
    justifyContent: 'flex-start',
  },
}))(FontAwesomeIcon);

export const RowFeedHeaderComponent = ({
  navigation,
  title,
  navigationKey,
}) => (
    <HeaderContainer>
      <HeaderIconContainer onPress={() => navigation.goBack(navigationKey)}>
        <BackIcon />
      </HeaderIconContainer>

      <HeaderTitle>{title}</HeaderTitle>

      <HeaderIconContainer>
        {/* 3 flex containers to help with even spacing */}
      </HeaderIconContainer>
    </HeaderContainer>
  );

RowFeedHeaderComponent.defaultProps = {
  title: '',
  navigationKey: null,
};

RowFeedHeaderComponent.propTypes = {
  title: PropTypes.string,
  navigationKey: PropTypes.string,
};

/**
 * This is where the component description lives
 * A FeedView wrapped in a query to pull content data.
 */
class ContentRowFeed extends PureComponent {
  /** Function for React Navigation to set information in the header. */
  static navigationOptions = ({ navigation }) => {
    const itemTitle = navigation.getParam('itemTitle', 'Content Channel');
    return {
      title: itemTitle,
      header: null,
    };
  };

  static propTypes = {
    /** Functions passed down from React Navigation to use in navigating to/from
     * items in the feed.
     */
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  /** Function that is called when a card in the feed is pressed.
   * Takes the user to the ContentSingle
   */
  handleOnPress = (item) => {
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      sharing: item.sharing,
    });
  };

  render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', []);
    const itemTitle = navigation.getParam('itemTitle', 'Content Channel');

    return (
      <BackgroundView style={{ flex: 1 }}>
        <RowFeedHeaderComponent navigation={navigation} title={itemTitle} />
        <Query
          query={GET_CONTENT_FEED}
          variables={{ itemId }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data, refetch, fetchMore, variables }) => (
            <SafeAreaView
              style={{ flex: 10 }}
              forceInset={{ top: 'never', bottom: 'never' }}
            >
              <FeedView
                ListItemComponent={TileRowCard}
                content={get(
                  data,
                  'node.childContentItemsConnection.edges',
                  []
                ).map(({ node }) => ({
                  ...node,
                  coverImage: get(node, 'coverImage.sources', []),
                  label: get(
                    node,
                    'tags[0]',
                    navigation.getParam('itemTitle', 'Content Channel')
                  ),
                }))}
                fetchMore={fetchMoreResolver({
                  collectionName: 'node.childContentItemsConnection',
                  fetchMore,
                  variables,
                  data,
                })}
                isLoading={loading}
                error={error}
                refetch={refetch}
                onPressItem={this.handleOnPress}
              />
            </SafeAreaView>
          )}
        </Query>
      </BackgroundView>
    );
  }
}

export default ContentRowFeed;
