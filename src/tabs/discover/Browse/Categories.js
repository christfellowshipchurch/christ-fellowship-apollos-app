import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import { styled, FeedView } from '@apollosproject/ui-kit';
import TileContentFeed from './TileContentFeed';
import { GET_CATEGORIES_FROM_FILTER } from './queries';

const feedItemLoadingState = {
  id: '',
  isLoading: true,
};

const StyledFeedView = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit,
}))(FeedView);

// Hack to get around a weird issue where the tabbar
// is cutting off the last row of cards
const EndCapSpacer = styled(({ theme }) => ({
  height: 200,
}))(View);

const mapData = (data) =>
  get(data, 'node.childContentItemsConnection.edges', []).map(
    (edges) => edges.node
  );

const renderItem = ({ item }) => <TileContentFeed {...item} />;

const Categories = ({
  filterId,
  FeedViewProps,
  isLoading: parentIsLoading,
}) => {
  const { loading, error, data, refetch } = useQuery(
    GET_CATEGORIES_FROM_FILTER,
    {
      variables: { id: filterId },
      fetchPolicy: 'cache-and-network',
      skip: !filterId || filterId === '' || parentIsLoading,
    }
  );

  const content = mapData(data);

  return (
    <StyledFeedView
      {...FeedViewProps}
      ListFooterComponent={<EndCapSpacer />}
      error={error}
      content={content}
      isLoading={loading || parentIsLoading}
      refetch={refetch}
      renderItem={renderItem}
      loadingStateObject={feedItemLoadingState}
      numColumns={1}
    />
  );
};

Categories.propTypes = {
  filterId: PropTypes.string,
  FeedViewProps: PropTypes.shape({
    ListHeaderComponent: PropTypes.any,
  }),
  isLoading: PropTypes.bool,
};

Categories.defaultProps = {
  filterId: null,
  FeedViewProps: {},
  isLoading: false,
};

export default Categories;
