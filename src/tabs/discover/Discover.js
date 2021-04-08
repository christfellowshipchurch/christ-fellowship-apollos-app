import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { get, throttle, take } from 'lodash';

import { ScrollView, View } from 'react-native';
import { BackgroundView, FeedView, styled } from '@apollosproject/ui-kit';
import DynamicThemeMixin from 'ui/DynamicThemeMixin';
import TabHeader from '../TabHeader';
import { GET_CATEGORIES_FROM_FILTER } from './queries';
import SearchInputHeader from './SearchInputHeader';
import SearchFeed from './SearchFeed';

import Filters from './Filters';
import TileContentFeed from './TileContentFeed';

const feedItemLoadingState = {
  id: '',
  isLoading: true,
};

const mapData = (data, path) => get(data, path, []).map((edges) => edges.node);
const renderItem = ({ item, cardsToShow }) => {
  const content = mapData(item, 'childContentItemsConnection.edges');

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

/**
 * note : the sticky header on the scrollview doesn't use a solid background color, so we just need to manually add one behind our header elements
 */
const HeaderBackgroundView = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
}))(View);

const Discover = ({ navigation, cardsToShow }) => {
  const [getCategories, { loading, error, data, called }] = useLazyQuery(
    GET_CATEGORIES_FROM_FILTER
  );

  const [isFocused, setIsFocused] = useState(
    get(navigation, 'params.showSearch', false)
  );
  const [searchText, setSearchText] = useState(
    get(navigation, 'params.searchText', '')
  );

  const content = mapData(data, 'node.childContentItemsConnection.edges');

  return (
    <DynamicThemeMixin>
      <BackgroundView>
        <TabHeader title="Discover" />
        <ScrollView stickyHeaderIndices={[0]}>
          <HeaderBackgroundView>
            <SearchInputHeader
              onChangeText={throttle(setSearchText, 300)}
              onFocus={setIsFocused}
            />
          </HeaderBackgroundView>

          {isFocused ? (
            <SearchFeed searchText={searchText} navigation={navigation} />
          ) : (
            <>
              <Filters
                onChange={(filterId) => {
                  getCategories({
                    variables: {
                      id: filterId,
                      cards: cardsToShow + 1,
                    },
                  });
                }}
              />
              <FeedView
                stickyHeaderIndices={[0]}
                content={content}
                error={error && !content.length}
                isLoading={loading || !called}
                loadingStateObject={feedItemLoadingState}
                renderItem={(props) => renderItem({ ...props, cardsToShow })}
                numColumns={1}
              />
            </>
          )}
        </ScrollView>
      </BackgroundView>
    </DynamicThemeMixin>
  );
};

Discover.propTypes = {
  cardsToShow: PropTypes.number,
};

Discover.defaultProps = {
  cardsToShow: 4,
};

export default Discover;
