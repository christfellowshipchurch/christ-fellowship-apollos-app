import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { defaultProps } from 'recompose';
import { get } from 'lodash';

import {
    FeedView,
    withMediaQuery,
    TouchableScale,
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
    onPressHeader,
    onPressItem,
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
        (content.length % numColumns === 0 && numColumns > 1) || dontAdjustContent
            ? content
            : [
                ...content,
                {
                    emptyItem: true,
                    style: { flex: numColumns - (content.length % numColumns) },
                },
            ];

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
                        {!!title &&
                            title !== '' && (
                                <FeedHeader
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
    onPressHeader: PropTypes.func,
    onPressItem: PropTypes.func,
};

CardFeed.defaultProps = {
    card: ActionRow,
    isLoading: false,
    content: [],
    title: null,
    seeMore: true,
    ListHeaderComponent: null,
    onPressHeader: () => null,
    onPressItem: (item, navigation) => {
        if (item.id) {
            navigation.navigate('ContentSingle', {
                itemId: item.id,
                sharing: item.sharing,
            });
        }
    },
};

const CardFeedWithNumColumns = withMediaQuery(
    ({ md }) => ({ maxWidth: md }),
    defaultProps({ numColumns: 1 }),
    defaultProps({ numColumns: 2 })
)(CardFeed);

export default CardFeedWithNumColumns;
