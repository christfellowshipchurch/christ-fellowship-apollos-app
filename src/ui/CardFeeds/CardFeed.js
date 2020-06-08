import React from 'react';
import PropTypes from 'prop-types';
import { withProps } from 'recompose';
import { withNavigation } from 'react-navigation';
import { get } from 'lodash';

import {
    FeedView,
    withMediaQuery,
    TouchableScale,
    FlexedView,
} from '@apollosproject/ui-kit';

import ActionRow from '../ActionRow';
import ContentCardConnected from '../ContentCardConnected';

const ContentFeed = ({
    card,
    content,
    navigation,
    error,
    isLoading,
    numColumns,
    ...additionalProps
}) => {
    /** Function that is called when a card in the feed is pressed.
     * Takes the user to the ContentSingle
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

    const adjustedContent =
        content.length % 2 === 0 && numColumns > 1
            ? content
            : [...content, { emptyItem: true }];

    return (
        <FeedView
            renderItem={renderItem}
            content={adjustedContent}
            isLoading={isLoading}
            error={error}
            numColumns={numColumns}
            {...additionalProps}
        />
    );
};

ContentFeed.propTypes = {
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
};

ContentFeed.defaultProps = {
    Component: null,
    card: ActionRow,
    isLoading: false,
    content: [],
    numColumns: 1,
};

const ContentFeedWithNumColumns = withMediaQuery(
    ({ md }) => ({ maxWidth: md }),
    withProps({ numColumns: 1 }),
    withProps({ numColumns: 2 })
)(ContentFeed);

export default withNavigation(ContentFeedWithNumColumns);
