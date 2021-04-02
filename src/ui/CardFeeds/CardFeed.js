import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { defaultProps } from 'recompose';
import { get } from 'lodash';

import {
  FeedView,
  withMediaQuery,
  TouchableScale,
  HorizontalTileFeed,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import ActionRow from '../ActionRow';
import { CardMapper } from '../Cards';
import FeedHeader from './FeedHeader';

const HorizontalFeedHeaderSpacing = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(View);

const StyledHorizontalTileFeed = withTheme(({ theme }) => ({
  style: {
    marginTop: theme.sizing.baseUnit * -1.25,
    paddingBottom: theme.sizing.baseUnit,
    zIndex: 1,
  },
}))(HorizontalTileFeed);

const generateLoadingStateData = (length) => {
  const loadingStateData = [];

  while (loadingStateData.length < length) {
    loadingStateData.push({
      id: `fakeId${0}`,
      isLoading: true,
      title: '',
      channelType: '',
      coverImage: [],
      parentChannel: {
        id: '',
        name: '',
      },
    });
  }

  return loadingStateData;
};

const CardFeed = ({
  CardComponent,
  content,
  navigation,
  error,
  isLoading,
  numColumns,
  title,
  seeMore,
  seeMoreText,
  ListHeaderComponent,
  FeedHeaderComponent,
  onPressHeader,
  onPressItem,
  horizontal,
  loadingStateDataLength,
  ...additionalProps
}) => {
  const renderItem = ({ item }) =>
    get(item, 'emptyItem') ? (
      <View {...item} />
    ) : (
      <TouchableScale
        onPress={() => onPressItem(item, navigation)}
        style={{ flex: get(item, 'flex', 1) }}
      >
        <CardMapper
          Component={CardComponent}
          {...item}
          nodeId={get(item, 'id')}
          inHorizontalList={horizontal}
        />
      </TouchableScale>
    );

  /** If we are in a loading or error state and we don't have existing content,
   *  we don't want to adjust the content to add an empty object.
   *
   *  If we are using a Horizontal Feed, we also don't care to adjust the content
   */
  const dontAdjustContent =
    ((isLoading || error) && content.length === 0) || horizontal;
  /** If we have valid data, the number of columns is at least 2 (for large devices),
   *  and the content length is odd, we want to add an empty item to the end of our
   *  array so that we can render an empty View to keep the spacing consistent for
   *  all elements. See stories for an example of "odd" content length
   */
  const adjustedContent =
    content.length % numColumns === 0 || numColumns <= 1 || dontAdjustContent
      ? content
      : [
          ...content,
          {
            emptyItem: true,
            style: { flex: numColumns - (content.length % numColumns) },
          },
        ];
  const feedProps = {
    renderItem,
    content: adjustedContent,
    isLoading,
    error,
    loadingStateData: generateLoadingStateData(loadingStateDataLength),
    ...(horizontal ? {} : { numColumns }),
    ...additionalProps,
  };

  return horizontal ? (
    <View>
      {!!title &&
        title !== '' && (
          <HorizontalFeedHeaderSpacing>
            <FeedHeaderComponent
              title={title}
              seeMore={seeMore}
              seeMoreText={seeMoreText}
              isLoading={isLoading}
              onPress={onPressHeader}
            />
          </HorizontalFeedHeaderSpacing>
        )}
      <StyledHorizontalTileFeed
        {...feedProps}
        ListHeaderComponent={ListHeaderComponent}
      />
    </View>
  ) : (
    <FeedView
      ListHeaderComponent={
        (ListHeaderComponent || title) && (
          <View>
            {!!title &&
              title !== '' && (
                <FeedHeaderComponent
                  title={title}
                  seeMore={seeMore}
                  isLoading={isLoading}
                  onPress={onPressHeader}
                />
              )}
            {ListHeaderComponent}
          </View>
        )
      }
      {...feedProps}
      renderItem={(props) => feedProps.renderItem({ ...props, numColumns })}
    />
  );
};

CardFeed.propTypes = {
  card: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  content: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  numColumns: PropTypes.number,
  title: PropTypes.string,
  seeMore: PropTypes.bool,
  seeMoreText: PropTypes.string,
  CardComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  ListHeaderComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  FeedHeaderComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  onPressHeader: PropTypes.func,
  onPressItem: PropTypes.func,
  horizontal: PropTypes.bool,
  loadingStateDataLength: PropTypes.number,
};

CardFeed.defaultProps = {
  card: ActionRow,
  isLoading: false,
  content: [],
  title: null,
  seeMore: true,
  ListHeaderComponent: null,
  FeedHeaderComponent: FeedHeader,
  onPressHeader: () => null,
  onPressItem: () => null,
  horizontal: false,
  error: null,
  loadingStateDataLength: 3,
};

const CardFeedWithNumColumns = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  defaultProps({ numColumns: 1 }),
  defaultProps({ numColumns: 2 })
)(CardFeed);

export default CardFeedWithNumColumns;
