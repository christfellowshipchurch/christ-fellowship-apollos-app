import React from 'react';
import PropTypes from 'prop-types';

import { VerticalCardListFeatureConnected as CoreVerticalCardListFeatureConnected } from '@apollosproject/ui-connected';
import { GridCardFeed } from 'ui/CardFeeds';

const VerticalCardListFeature = ({
    cards,
    isLoading,
    listKey,
    onPressItem,
    subtitle,
    title,
}) => (
        <GridCardFeed
            title={title}
            content={cards}
            removeClippedSubviews={false}
            onPressItem={onPressItem}
            isLoading={isLoading}
            listKey={listKey}
        />
    );

VerticalCardListFeature.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isLoading: PropTypes.bool,
    listKey: PropTypes.string,
    loadingStateObject: PropTypes.shape({}),
    onPressItem: PropTypes.func,
    subtitle: PropTypes.string,
    title: PropTypes.string,
};

const VerticalCardListFeatureConnected = (props) => (
    <CoreVerticalCardListFeatureConnected
        {...props}
        Component={VerticalCardListFeature}
    />
);

export default VerticalCardListFeatureConnected;
