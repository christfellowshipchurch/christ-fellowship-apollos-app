// This file was largely copied from `FeaturesFeedConnected`
// from the @apollosproject/ui-connected package
import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import { FeedView } from '@apollosproject/ui-kit';
import { featuresFeedComponentMapper } from '@apollosproject/ui-connected';

import PrayerFeatureConnected from '../PrayerFeatureConnected';

import GET_HEADER_FEATURES from './getHeaderFeatures';

// The Core Components for Features are created to work for a feed-type view.
// Since we have a completely different type of horizontal scrolling experience
// for Header Features, we want to override all Core Components with a `null`
// value so that we don't accidentally add a feature that breaks the entire UI.
// This will also allow for us to backlog specific items to go in and create
// experiences for each of these Feature types that are unique to this visual
// expression
const MAPPINGS = {
    ActionListFeature: () => null,
    HeroListFeature: () => null,
    HorizontalCardListFeature: () => null,
    VerticalCardListFeature: () => null,
    LiveStreamListFeature: () => null,
    PrayerListFeature: PrayerFeatureConnected,
};

const FeaturesHeaderConnected = ({
    Component,
    onPressActionItem,
    additionalFeatures,
    ...props
}) => {
    const { error, data, loading, refetch } = useQuery(GET_HEADER_FEATURES, {
        fetchPolicy: 'cache-and-network',
    });

    const refetchFunctions = {};
    const loadingStateObject = [
        {
            isLoading: true,
            __typename: 'LiveStreamListFeature',
            id: 'feature1',
        },
    ];

    // eslint-disable-next-line
    const refetchRef = ({ refetch, id }) => (refetchFunctions[id] = refetch);

    const refetchWithMapping = () => {
        Promise.all(Object.values(refetchFunctions).map((rf) => rf()));
    };

    const renderFeatures = ({ item }) =>
        featuresFeedComponentMapper({
            feature: item,
            refetchRef,
            onPressActionItem,
            additionalFeatures: MAPPINGS,
        });

    const features = get(data, 'userHeaderFeatures', []);
    refetchRef({ refetch, id: 'feed' });

    return (
        <FeedView
            error={error}
            content={features}
            loadingStateData={loadingStateObject}
            renderItem={renderFeatures}
            loading={loading}
            refetch={refetchWithMapping}
            {...props}
        />
    );
};

FeaturesHeaderConnected.propTypes = {
    Component: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.object, // type check for React fragments
    ]),
    onPressActionItem: PropTypes.func,
    additionalFeatures: PropTypes.shape({}),
};

export default FeaturesHeaderConnected;
