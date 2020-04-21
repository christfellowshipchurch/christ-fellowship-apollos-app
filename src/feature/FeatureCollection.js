import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

import { HorizontalDivider } from '../ui/Dividers';

import Feature from './Feature';

const renderItem = ({ item }) => (
    <>
        <Feature {...item} />
        <HorizontalDivider />
    </>
);
const renderDivider = () => <HorizontalDivider />;

const FeatureCollection = ({ actions, title }) => (
    <FlatList
        data={actions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeperatorComponent={renderDivider}
        removeClippedSubviews={false}
        numColumns={1}
    />
);

FeatureCollection.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({})),
};

FeatureCollection.defaultProps = {};

export default FeatureCollection;
