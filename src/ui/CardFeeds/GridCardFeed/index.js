import React from 'react';
import PropTypes from 'prop-types';
import { drop, dropRight, head, last } from 'lodash';
import { withProps } from 'recompose';

import {
    FeedView,
    TouchableScale,
    withMediaQuery,
    withTheme,
} from '@apollosproject/ui-kit';

import { HighlightCard, RowCard, ColumnCard } from '../../Cards';
import ContentCardConnected from '../../ContentCardConnected';
import CardFeed from '../CardFeed';

const CapCard = ({ id, onPress, isLoading, ...props }) => (
    <TouchableScale
        onPress={isLoading ? () => null : onPress}
        style={{ flex: 1 }}
    >
        <ContentCardConnected {...props} contentId={id} isLoading={isLoading} />
    </TouchableScale>
);

const StyledCardFeed = withTheme(({ theme }) => ({
    ListHeaderComponentStyle: {
        marginHorizontal: theme.sizing.baseUnit * -0.5,
    },
    ListFooterComponentStyle: {
        marginHorizontal: theme.sizing.baseUnit * -0.5,
    },
    style: {
        paddingHorizontal: theme.sizing.baseUnit * 0.5,
    },
}))(CardFeed);

/** Maps the content into the correct buckets.
 *  Returns: hero, body, footer, numColumns
 */
const mapContentDefault = (content) => {
    /** We want to send the CardFeed all but the first data item so we
     *  can display that first item as a larger card.
     */
    const hero = head(content);

    /** For small displays, we want to use an elongated row card for the
     *  last item when we have a single item at the end of our content.
     */
    const useFooterItem = content.length % 2 === 0;
    const footer = useFooterItem ? last(content) : null;

    /** We always want to drop the first item, but if we are using a footer
     *  row, we also want to drop the last item from our collection.
     */
    const body = useFooterItem ? dropRight(drop(content)) : drop(content);

    return { hero, footer, body, numColumns: 2 };
};

/** Maps the content into the correct buckets for large displays.
 *  Returns: hero, body, footer, numColumns
 */
const mapContentMd = (content) => {
    /** We only want to use a hero card if there is only 1 item or if there
     *  are more than 2. Having 1 item means that single item will be the hero,
     *  having 2 should display both cards side-by-side, having more than 2
     *  should display the hero card and then the rest of the content underneath
     */
    const useHero = content.length > 2 || content.length === 1;
    const hero = useHero ? head(content) : null;

    /** If we are using a hero card, let's remove that card from our collection.
     */
    let body = useHero ? drop(content) : content;
    if (body.length === 2) {
        body = body.map((item) => ({ ...item, card: HighlightCard }));
    }

    /** For large displays, we don't want a footer item, we only want
     *  a fynamic number of columns. We return null for everything
     */
    const footer = null;

    return { hero, footer, body, numColumns: body.length === 2 ? 2 : 3 };
};

const GridCardFeed = ({
    content,
    navigation,
    error,
    isLoading,
    forceRatio,
    mapContent,
    ...additionalProps
}) => {
    const { hero, body, footer, numColumns } = mapContent(content);

    /** Function that is called when the first card is pressed.
     *  This is the same as the rest of the cards, but it needs
     *  be manually passed into the header.
     */
    const onPressItem = (item) => {
        if (item.id) {
            navigation.navigate('ContentSingle', {
                itemId: item.id,
                sharing: item.sharing,
            });
        }
    };

    const showHero = (!error && hero) || isLoading;

    return (
        <StyledCardFeed
            card={ColumnCard}
            numColumns={numColumns}
            content={body}
            isLoading={isLoading}
            error={error}
            ListHeaderComponent={
                showHero && (
                    <CapCard
                        onPress={() => onPressItem(hero)}
                        {...hero}
                        forceRatio={forceRatio}
                        isLoading={isLoading && !content.length}
                        card={HighlightCard}
                    />
                )
            }
            ListFooterComponent={
                !error &&
                footer && (
                    <CapCard
                        onPress={() => onPressItem(footer)}
                        {...footer}
                        forceRatio={forceRatio}
                        isLoading={isLoading && !content.length}
                        card={RowCard}
                    />
                )
            }
            navigation={navigation}
            {...additionalProps}
        />
    );
};

GridCardFeed.propTypes = {
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
    forceRatio: PropTypes.number,
    mapContent: PropTypes.func,
};

GridCardFeed.defaultProps = {
    isLoading: false,
    content: [],
    withHeroCard: false,
};

GridCardFeed.displayName = 'GridCardFeed';

const GridCardFeedWithNumColumns = withMediaQuery(
    ({ md }) => ({ maxWidth: md }),
    withProps({ forceRatio: null, mapContent: mapContentDefault }),
    withProps({ forceRatio: 2.333, mapContent: mapContentMd })
)(GridCardFeed);

export default GridCardFeedWithNumColumns;
