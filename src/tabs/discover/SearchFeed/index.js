import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { withProps } from 'recompose';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';

import { View } from 'react-native';
import {
  FeedView,
  styled,
  withMediaQuery,
  FlexedView,
  TouchableScale,
} from '@apollosproject/ui-kit';

import ContentCardConnected from 'ui/ContentCardConnected';
import ActionRow from 'ui/ActionRow';
import DynamicThemeMixin from 'ui/DynamicThemeMixin';
import GET_SEARCH_RESULTS from './getSearchResults';
import NoResults from './NoResults';

const SearchCardConnected = withProps(() => ({
  card: ActionRow,
}))(ContentCardConnected);

// this could be refactored into a custom effect hook 💥
const StyledFeedView = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps(({ hasContent, isLoading }) => ({
    numColumns: 1,
    contentContainerStyle: {
      ...(hasContent || isLoading ? {} : { flex: 1 }),
    },
  })),
  withProps(({ hasContent, isLoading }) => ({
    numColumns: 2,
    contentContainerStyle: {
      ...(hasContent || isLoading ? {} : { flex: 1 }),
    },
  }))
)(FeedView);

const keyExtractor = (item) => item && get(item, 'id', null);
const mapSearchData = (data, navigation) =>
  get(data, 'search.edges', []).map(({ node }) => ({
    ...node,
    navigation,
  }));
const renderItem = ({ item }) => (
  <FlexedView>
    <TouchableScale onPress={item.onPress}>
      <DynamicThemeMixin>
        <SearchCardConnected contentId={item.id} {...item} />
      </DynamicThemeMixin>
    </TouchableScale>
  </FlexedView>
);

export const SearchFeed = ({
  searchText,
  content,
  isLoading,
  error,
  refetch,
}) => {
  const navigation = useNavigation();
  const adjustedContent = content.map((item) => ({
    ...item,
    onPress: () => {
      navigation.navigate('ContentSingle', {
        itemId: item.id,
        transitionKey: item.transitionKey,
      });
    },
  }));

  return (
    <StyledFeedView
      renderItem={renderItem}
      content={adjustedContent}
      ListEmptyComponent={() => <NoResults searchText={searchText} />}
      hasContent={adjustedContent.length}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      keyExtractor={keyExtractor}
    />
  );
};

SearchFeed.propTypes = {
  searchText: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool,
  ]),
  content: PropTypes.array, // todo
  refetch: PropTypes.func,
};

SearchFeed.defaultProps = {
  searchText: '',
  isLoading: false,
  content: [], // todo
};

const SearchFeedConnected = ({ searchText }) => {
  const { data, loading, error, refetch } = useQuery(GET_SEARCH_RESULTS, {
    variables: { searchText },
    fetchPolicy: 'cache-and-network',
    skip: !searchText || searchText === '',
  });

  const content = mapSearchData(data);

  return (
    <SearchFeed
      content={content}
      isLoading={loading}
      error={error}
      refetch={refetch}
      searchText={searchText}
    />
  );
};

SearchFeedConnected.propTypes = {
  searchText: PropTypes.string,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default SearchFeedConnected;
