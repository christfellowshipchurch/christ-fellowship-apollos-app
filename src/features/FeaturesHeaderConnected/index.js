// This file was largely copied from `FeaturesFeedConnected`
// from the @apollosproject/ui-connected package
import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import { FlexedView, styled } from '@apollosproject/ui-kit';
import { featuresFeedComponentMapper } from '@apollosproject/ui-connected';

import PrayerFeatureConnected from '../PrayerFeatureConnected';
import LiveStreamListFeatureConnected from '../LiveStreamListFeatureConnected';

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
    PrayerListFeature: PrayerFeatureConnected,
    LiveStreamListFeature: LiveStreamListFeatureConnected,
};

const Container = styled(({ theme }) => ({
    flexDirection: 'row',
    paddingHorizontal: theme.sizing.baseUnit * 0.5,
    paddingTop: theme.sizing.baseUnit * 0.5,
    paddingBottom: theme.sizing.baseUnit,
}))(View);

const mapFeatures = (
    features,
    { additionalFeatures, refetchRef, onPressActionItem }
) =>
    features.map((item, i) =>
        featuresFeedComponentMapper({
            feature: item,
            refetchRef,
            onPressActionItem,
            additionalFeatures: { ...MAPPINGS, ...additionalFeatures },
        })
    );

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

    const renderFeatures = ({ item }) => (
        <FlexedView style={{ flexDirection: 'row' }}>
            {featuresFeedComponentMapper({
                feature: item,
                refetchRef,
                onPressActionItem,
                additionalFeatures: { ...MAPPINGS, ...additionalFeatures },
            })}
        </FlexedView>
    );

    const features = get(data, 'userHeaderFeatures', []);
    refetchRef({ refetch, id: 'feed' });

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            error={error}
            content={features}
            loadingStateData={loadingStateObject}
            renderItem={renderFeatures}
            loading={loading}
            refetch={refetchWithMapping}
            {...props}
        >
            <Container>{mapFeatures(features, { refetchRef })}</Container>
        </ScrollView>
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
