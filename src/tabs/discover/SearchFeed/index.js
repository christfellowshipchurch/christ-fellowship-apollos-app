import React from 'react';
import { View } from 'react-native';
import { withProps } from 'recompose';
import { withNavigation } from 'react-navigation';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { FeedView, styled } from '@apollosproject/ui-kit';

import ContentCardConnected from '../../../ui/ContentCardConnected';
import ActionRow from '../../../ui/ActionRow';
import GET_SEARCH_RESULTS from './getSearchResults';
import NoResults from './NoResults';

const SearchCardConnected = (props) => (
  <ContentCardConnected {...props} card={ActionRow} />
);

// this could be refactored into a custom effect hook 💥
const StyledFeedView = withProps(({ hasContent }) => ({
  contentContainerStyle: {
    ...(hasContent ? {} : { flex: 1 }),
  },
}))(FeedView);

// Hack to get around a weird issue where the tabbar
// is cutting off the last row of cards
const EndCapSpacer = styled(({ theme }) => ({
  height: 150,
}))(View);

const handleOnPress = ({ navigation, item }) => {
  const id = get(item, 'id', null);
  return navigation.navigate('ContentSingle', {
    itemId: id,
    transitionKey: item.transitionKey,
  });
};

const keyExtractor = (item) => item && get(item, 'id', null);
const mapData = (data) => get(data, 'search.edges', []).map(({ node }) => node);

const SearchFeed = withNavigation(({ navigation, searchText }) => (
  <Query
    query={GET_SEARCH_RESULTS}
    variables={{ searchText }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data, refetch }) => (
      <StyledFeedView
        ListItemComponent={SearchCardConnected}
        content={mapData(data)}
        ListEmptyComponent={() => <NoResults searchText={searchText} />}
        ListFooterComponent={<EndCapSpacer />}
        hasContent={get(data, 'search.edges', []).length}
        isLoading={loading}
        error={error}
        refetch={refetch}
        onPressItem={(item) => handleOnPress({ navigation, item })}
        keyExtractor={keyExtractor}
        numColumns={1}
      />
    )}
  </Query>
));

SearchFeed.propTypes = {
  searchText: PropTypes.string,
};

export default SearchFeed;
