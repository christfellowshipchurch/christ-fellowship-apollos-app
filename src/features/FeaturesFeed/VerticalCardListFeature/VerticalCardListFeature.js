import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import ActionRow from 'ui/ActionRow';
import { CardFeed } from '../../../ui/CardFeeds';

const VerticalCardListFeature = ({
  cards,
  error,
  isLoading,
  forceRatio,
  mapContent,
  onPressItem,
  ...additionalProps
}) => (
  <CardFeed
    onPressItem={onPressItem}
    CardComponent={ActionRow}
    content={cards}
    isLoading={isLoading && !cards.length}
    error={error}
    seeMore={false}
    removeClippedSubviews={false}
    {...additionalProps}
  />
);

VerticalCardListFeature.propTypes = {
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  forceRatio: PropTypes.number,
  mapContent: PropTypes.func,
  onPressItem: PropTypes.func,

  cards: PropTypes.arrayOf(PropTypes.shape({})),
  listKey: PropTypes.string,
  loadingStateObject: PropTypes.shape({}),
  title: PropTypes.string,
};

VerticalCardListFeature.defaultProps = {
  isLoading: false,
  cards: [],
};

VerticalCardListFeature.displayName = 'VerticalCardListFeature';

export default VerticalCardListFeature;
