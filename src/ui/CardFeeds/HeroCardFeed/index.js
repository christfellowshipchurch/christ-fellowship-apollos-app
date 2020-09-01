import React from 'react';
import PropTypes from 'prop-types';
import { drop, head } from 'lodash';
import { withProps } from 'recompose';

import { TouchableScale, withMediaQuery } from '@apollosproject/ui-kit';

import { HighlightCard } from '../../Cards';
import ContentCardConnected from '../../ContentCardConnected';
import CardFeed from '../CardFeed';

const HeroCard = ({ id, onPress, isLoading, ...props }) => (
  <TouchableScale
    onPress={isLoading ? () => null : onPress}
    style={{ flex: 1 }}
  >
    <ContentCardConnected
      card={HighlightCard}
      {...props}
      contentId={id}
      isLoading={isLoading}
    />
  </TouchableScale>
);

const HeroCardFeed = ({
  content,
  navigation,
  error,
  isLoading,
  forceRatio,
  onPressHero,
  ...additionalProps
}) => {
  /** We want to send the CardFeed all but the first data item so we
   *  can display that first item as a larger card.
   */
  const heroItem = head(content);
  const adjustedContent = drop(content);

  return (
    <CardFeed
      content={adjustedContent}
      isLoading={isLoading}
      error={error}
      ListHeaderComponent={
        !error && (
          <HeroCard
            onPress={() => onPressHero(heroItem, navigation)}
            {...heroItem}
            forceRatio={forceRatio}
            isLoading={isLoading && !content.length}
          />
        )
      }
      navigation={navigation}
      {...additionalProps}
    />
  );
};

HeroCardFeed.propTypes = {
  /** Functions passed down from React Navigation to use in navigating to/from
   * items in the feed.
   */
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  content: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.any,
  numColumns: PropTypes.number,
  withHeroCard: PropTypes.bool,
  onPressHero: PropTypes.func,
  forceRatio: PropTypes.bool,
};

HeroCardFeed.defaultProps = {
  isLoading: false,
  content: [],
  onPressHero: (heroItem, navigation) => {
    if (heroItem.id) {
      navigation.navigate('ContentSingle', {
        itemId: heroItem.id,
        sharing: heroItem.sharing,
      });
    }
  },
};

HeroCardFeed.displayName = 'HeroCardFeed';

const HeroCardFeedWithNumColumns = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps({ forceRatio: null }),
  withProps({ forceRatio: 2.333 })
)(HeroCardFeed);

export default HeroCardFeedWithNumColumns;
