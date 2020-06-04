import React from 'react';
import { View } from 'react-native';
import { withProps } from 'recompose';
import { withNavigation } from 'react-navigation';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  FeedView,
  styled,
  withMediaQuery,
  FlexedView,
  TouchableScale,
} from '@apollosproject/ui-kit';

import ContentCardConnected from '../../../ui/ContentCardConnected';
import ActionRow from '../../../ui/ActionRow';
import GET_SEARCH_RESULTS from './getSearchResults';
import NoResults from './NoResults';

const SearchCardConnected = withProps(() => ({
  card: ActionRow,
}))(ContentCardConnected);

// this could be refactored into a custom effect hook 💥
const StyledFeedView = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps(({ hasContent }) => ({
    numColumns: 1,
    contentContainerStyle: {
      ...(hasContent ? {} : { flex: 1 }),
    },
  })),
  withProps(({ hasContent }) => ({
    numColumns: 2,
    contentContainerStyle: {
      ...(hasContent ? {} : { flex: 1 }),
    },
  }))
)(FeedView);

// Hack to get around a weird issue where the tabbar
// is cutting off the last row of cards
const EndCapSpacer = styled(({ theme }) => ({
  height: 150,
}))(View);

const handleOnPress = ({ navigation, id, transitionKey }) =>
  navigation.navigate('ContentSingle', {
    itemId: id,
    transitionKey,
  });

const keyExtractor = (item) => item && get(item, 'id', null);
const mapData = (data, navigation) =>
  get(data, 'search.edges', []).map(({ node }) => ({
    ...node,
    navigation,
  }));
const renderItem = ({ item }) => (
  <FlexedView>
    <TouchableScale
      onPress={() =>
        handleOnPress({
          id: item.id,
          navigation: item.navigation,
          transitionKey: item.transitionKey,
        })
      }
    >
      <SearchCardConnected contentId={item.id} {...item} />
    </TouchableScale>
  </FlexedView>
);

const SearchFeed = withNavigation(({ navigation, searchText }) => (
  <Query
    query={GET_SEARCH_RESULTS}
    variables={{ searchText }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data, refetch }) => (
      <StyledFeedView
        renderItem={renderItem}
        content={mapData(data, navigation)}
        ListEmptyComponent={() => <NoResults searchText={searchText} />}
        ListFooterComponent={<EndCapSpacer />}
        hasContent={get(data, 'search.edges', []).length}
        isLoading={loading}
        error={error}
        refetch={refetch}
        onPressItem={(item) => handleOnPress({ navigation, item })}
        keyExtractor={keyExtractor}
      />
    )}
  </Query>
));

SearchFeed.propTypes = {
  searchText: PropTypes.string,
};

export default SearchFeed;
