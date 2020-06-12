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
    ...additionalProps
}) => {
    /** We want to send the CardFeed all but the first data item so we
     *  can display that first item as a larger card.
     */
    const heroItem = head(content);
    const adjustedContent = drop(content);

    /** Function that is called when the first card is pressed.
     *  This is the same as the rest of the cards, but it needs
     *  be manually passed into the header.
     */
    const onPressHero = () => {
        if (heroItem.id) {
            navigation.navigate('ContentSingle', {
                itemId: heroItem.id,
                sharing: heroItem.sharing,
            });
        }
    };

    console.log({ additionalProps });

    return (
        <CardFeed
            content={adjustedContent}
            isLoading={isLoading}
            error={error}
            ListHeaderComponent={
                !error && (
                    <HeroCard
                        onPress={onPressHero}
                        {...heroItem}
                        forceRatio={forceRatio}
                        isLoading={isLoading && !content.length}
                    />
                )
            }
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
};

HeroCardFeed.defaultProps = {
    isLoading: false,
    content: [],
};

HeroCardFeed.displayName = 'HeroCardFeed';

const HeroCardFeedWithNumColumns = withMediaQuery(
    ({ md }) => ({ maxWidth: md }),
    withProps({ forceRatio: null }),
    withProps({ forceRatio: 2.333 })
)(HeroCardFeed);

export default HeroCardFeedWithNumColumns;
