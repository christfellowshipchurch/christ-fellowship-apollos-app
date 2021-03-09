import React from 'react';
import PropTypes from 'prop-types';
import ApollosConfig from '@apollosproject/config';
import { drop, head, take } from 'lodash';
import { withProps } from 'recompose';

import {
  TouchableScale,
  withMediaQuery,
  styled,
  ImageSourceType,
} from '@apollosproject/ui-kit';

import ActionRow from '../../../ui/ActionRow';
import { CardMapper, HighlightCard } from '../../../ui/Cards';
import { CardFeed } from '../../../ui/CardFeeds';

const { FEATURE_FEEDS } = ApollosConfig;

const { heroListLength } = FEATURE_FEEDS;

const FlexedTouchable = styled(() => ({
  flex: 1,
}))(TouchableScale);

const HeroCard = ({ id, onPress, isLoading, ...props }) => (
  <FlexedTouchable onPress={isLoading ? () => null : onPress}>
    <CardMapper
      Component={HighlightCard}
      {...props}
      nodeId={id}
      isLoading={isLoading}
    />
  </FlexedTouchable>
);

HeroCard.propTypes = {
  id: PropTypes.string,
  onPress: PropTypes.func,
  isLoading: PropTypes.bool,
};

const HeroListFeature = ({
  actions,
  error,
  isLoading,
  forceRatio,
  onPressItem,
  heroCard,
  primaryAction,
  ...additionalProps
}) => {
  /**
   * note : We want to send the CardFeed all but the first data item so we can display that first item as a larger card.
   */
  const mappedActions = actions.map((action) => ({
    ...action,
    coverImage: action?.image?.sources,
    summary: action?.subtitle,
  }));
  const adjustedContent = take(mappedActions, heroListLength - 1);
  const seeMore =
    !!primaryAction?.title &&
    !!primaryAction?.action &&
    !!primaryAction?.relatedNode?.id;

  return (
    <CardFeed
      content={adjustedContent}
      isLoading={isLoading && !heroCard}
      error={error}
      onPressItem={onPressItem}
      CardComponent={ActionRow}
      ListHeaderComponent={
        !error && (
          <HeroCard
            onPress={() => onPressItem(heroCard)}
            {...heroCard}
            coverImage={heroCard?.coverImage?.sources}
            forceRatio={forceRatio}
            isLoading={isLoading && !actions.length}
          />
        )
      }
      seeMore={seeMore}
      seeMoreText={primaryAction?.title}
      onPressHeader={() => onPressItem(primaryAction)}
      {...additionalProps}
    />
  );
};

HeroListFeature.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  numColumns: PropTypes.number,
  withHeroCard: PropTypes.bool,
  onPressItem: PropTypes.func,
  forceRatio: PropTypes.bool,
  heroCard: PropTypes.shape({
    action: PropTypes.string,
    title: PropTypes.string,
    hasAction: PropTypes.bool,
    actionIcon: PropTypes.string,
    labelText: PropTypes.string,
    summary: PropTypes.string,
    coverImage: ImageSourceType,
  }),
  primaryAction: PropTypes.shape({
    title: PropTypes.string,
    action: PropTypes.string,
    relatedNode: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

HeroListFeature.defaultProps = {
  isLoading: false,
  actions: [],
};

HeroListFeature.displayName = 'HeroListFeature';

const HeroListFeatureWithNumColumns = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps({ forceRatio: null }),
  withProps({ forceRatio: 2.333 })
)(HeroListFeature);

export default HeroListFeatureWithNumColumns;
