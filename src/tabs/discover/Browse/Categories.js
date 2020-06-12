import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get, take } from 'lodash';

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
  height: 250,
}))(View);

const mapData = (data, path) => get(data, path, []).map((edges) => edges.node);

const renderItem = ({ item }) => {
  const content = mapData(item, 'childContentItemsConnection.edges');
  const cardsToShow = get(item, 'cardsToShow', 4);

  return (
    <TileContentFeed
      id={item.id}
      name={item.title}
      content={take(content, cardsToShow)}
      viewAll={content.length > cardsToShow}
      isLoading={item.isLoading}
    />
  );
};

const Categories = ({ filterId, isLoading: parentIsLoading, cardsToShow }) => {
  const { loading, error, data, refetch } = useQuery(
    GET_CATEGORIES_FROM_FILTER,
    {
      variables: { id: filterId, cards: cardsToShow + 1 },
      fetchPolicy: 'cache-and-network',
      skip: !filterId || filterId === '' || parentIsLoading,
    }
  );

  const content = mapData(data, 'node.childContentItemsConnection.edges');

  return (
    <StyledFeedView
      extraData={{ cardsToShow }}
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
  isLoading: PropTypes.bool,
  cardsToShow: PropTypes.number,
};

Categories.defaultProps = {
  filterId: null,
  isLoading: false,
  cardsToShow: 4,
};

export default Categories;
