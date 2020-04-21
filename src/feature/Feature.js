import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import ContentCardConnected from '../ui/ContentCardConnected';
import { CardFeed, GridFeed } from './features';

const Feature = ({ title, action, relatedNode, isLoading }) => {
    const itemId = get(relatedNode, 'id');
    switch (action) {
        case 'READ_GLOBAL_CONTENT':
            return <GridFeed itemId={itemId} isLoading={isLoading} />;
        case 'VIEW_CHILDREN':
            return <CardFeed title={title} itemId={itemId} isLoading={isLoading} />;
        default:
            return <ContentCardConnected contentId={itemId} isLoading={isLoading} />;
    }
};

Feature.propTypes = {
    title: PropTypes.string,
    action: PropTypes.string,
    relatedNode: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
    isLoading: PropTypes.bool,
};

Feature.defaultProps = {};

export default Feature;
