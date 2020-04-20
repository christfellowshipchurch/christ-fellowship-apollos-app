import React from 'react';
import PropTypes from 'prop-types';

import ContentCardConnected from '../ui/ContentCardConnected';
import { CardFeed, GridFeed } from './features';

const Feature = ({ title, action, relatedNode }) => {
    switch (action) {
        case 'READ_GLOBAL_CONTENT':
            return <GridFeed itemId={relatedNode.id} />;
        case 'VIEW_CHILDREN':
            return <CardFeed title={title} itemId={relatedNode.id} />;
        default:
            return <ContentCardConnected contentId={relatedNode.id} />;
    }
};

Feature.propTypes = {
    title: PropTypes.string,
    action: PropTypes.string,
    relatedNode: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
};

Feature.defaultProps = {};

export default Feature;
