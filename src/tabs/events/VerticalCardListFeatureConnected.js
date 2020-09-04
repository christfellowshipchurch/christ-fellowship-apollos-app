import React from 'react';
import PropTypes from 'prop-types';

import { VerticalCardListFeatureConnected as CoreVerticalCardListFeatureConnected } from '@apollosproject/ui-connected';
import { CardFeed } from 'ui/CardFeeds';
import { ActionRow } from 'ui/ActionRow';

const VerticalCardListFeature = ({
  cards,
  isLoading,
  listKey,
  onPressItem,
  title,
}) => (
    <CardFeed
      title={title}
      content={cards}
      removeClippedSubviews={false}
      onPressItem={onPressItem}
      isLoading={isLoading}
      listKey={listKey}
      seeMore={false}
      card={ActionRow}
    />
  );

VerticalCardListFeature.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isLoading: PropTypes.bool,
  listKey: PropTypes.string,
  loadingStateObject: PropTypes.shape({}),
  onPressItem: PropTypes.func,
  title: PropTypes.string,
};

const VerticalCardListFeatureConnected = (props) => (
  <CoreVerticalCardListFeatureConnected
    {...props}
    Component={VerticalCardListFeature}
  />
);

export default VerticalCardListFeatureConnected;
