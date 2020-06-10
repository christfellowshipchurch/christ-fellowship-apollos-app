import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { withProps } from 'recompose';
import { get } from 'lodash';

import {
    FeedView,
    withMediaQuery,
    TouchableScale,
    FlexedView,
} from '@apollosproject/ui-kit';

import ActionRow from '../ActionRow';
import ContentCardConnected from '../ContentCardConnected';
import FeedHeader from './FeedHeader';

const CardFeed = ({
    card,
    content,
    navigation,
    error,
    isLoading,
    numColumns,
    title,
    seeMore,
    ListHeaderComponent,
    ...additionalProps
}) => {
    /** Function that is called when a card in the feed is pressed.
     *  Takes the user to the ContentSingle
     */
    const onPress = (item) => {
        navigation.navigate('ContentSingle', {
            itemId: item.id,
            sharing: item.sharing,
        });
    };

    const renderItem = ({ item }) =>
        get(item, 'emptyItem') ? (
            <FlexedView />
        ) : (
                <TouchableScale onPress={() => onPress(item)} style={{ flex: 1 }}>
                    <ContentCardConnected
                        card={card}
                        {...item}
                        contentId={get(item, 'id')}
                    />
                </TouchableScale>
            );

    /** If we are in a loading or error state and we don't have existing content,
     *  we don't want to adjust the content to add an empty object
     */
    const dontAdjustContent = (isLoading || error) && content.length === 0;
    /** If we have valid data, the number of columns is at least 2 (for large devices),
     *  and the content length is odd, we want to add an empty item to the end of our
     *  array so that we can render an empty View to keep the spacing consistent for
     *  all elements. See stories for an example of "odd" content length
     */
    const adjustedContent =
        (content.length % 2 === 0 && numColumns > 1) || dontAdjustContent
            ? content
            : [...content, { emptyItem: true }];

    return (
        <FeedView
            renderItem={renderItem}
            content={adjustedContent}
            isLoading={isLoading}
            error={error}
            numColumns={numColumns}
            ListHeaderComponent={
                (ListHeaderComponent || title) && (
                    <View>
                        {title && (
                            <FeedHeader
                                title={title}
                                seeMore={seeMore}
                                isLoading={isLoading}
                            />
                        )}
                        {ListHeaderComponent}
                    </View>
                )
            }
            {...additionalProps}
        />
    );
};

CardFeed.propTypes = {
    /** Functions passed down from React Navigation to use in navigating to/from
     * items in the feed.
     */
    navigation: PropTypes.shape({
        getParam: PropTypes.func,
        navigate: PropTypes.func,
    }),
    card: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
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
    title: PropTypes.string,
    seeMore: PropTypes.bool,
    ListHeaderComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};

CardFeed.defaultProps = {
    card: ActionRow,
    isLoading: false,
    content: [],
    numColumns: 1,
    title: null,
    seeMore: true,
    ListHeaderComponent: null,
};

const CardFeedWithNumColumns = withMediaQuery(
    ({ md }) => ({ maxWidth: md }),
    withProps({ numColumns: 1 }),
    withProps({ numColumns: 2 })
)(CardFeed);

export default CardFeedWithNumColumns;
