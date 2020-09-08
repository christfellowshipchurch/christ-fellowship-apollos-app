import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { HorizontalCardListFeatureConnected as CoreHorizontalCardListFeatureConnected } from '@apollosproject/ui-connected';
import { CardFeed } from 'ui/CardFeeds';

const HorizontalCardListFeature = ({
  featureId,
  isLoading,
  title,
  cards,
  onPressItem,
  primaryAction,
}) => {
  const seeMore =
    get(primaryAction, 'title', '') !== '' &&
    get(primaryAction, 'action', '') !== '' &&
    get(primaryAction, 'relatedNode.id', '') !== '';

  const onPressHeader = () => {
    onPressItem(primaryAction);
  };

  console.log({ title, cards });

  return (
    <CardFeed
      title={title}
      content={cards}
      removeClippedSubviews={false}
      isLoading={isLoading}
      key={featureId}
      seeMore={seeMore}
      seeMoreText={get(primaryAction, 'title', '')}
      onPressItem={onPressItem}
      onPressHeader={onPressHeader}
      loadingStateObject={{
        id: 'fake_id',
        title: '',
        coverImage: [],
        avatars: [],
      }}
      horizontal
    />
  );
};

HorizontalCardListFeature.propTypes = {
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  primaryAction: PropTypes.shape({
    action: PropTypes.string,
  }),
  onPressItem: PropTypes.func,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
};

const HorizontalCardListFeatureConnected = (props) => (
  <CoreHorizontalCardListFeatureConnected
    {...props}
    Component={HorizontalCardListFeature}
  />
);

export default HorizontalCardListFeatureConnected;
