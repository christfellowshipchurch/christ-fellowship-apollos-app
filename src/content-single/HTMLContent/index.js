import React from 'react';
import PropTypes from 'prop-types';

import { ContentHTMLViewConnected } from '@apollosproject/ui-connected';
import { useLinkRouter } from '../../hooks';

const HTMLContent = ({ contentId }) => {
  const { routeLink } = useLinkRouter();

  return (
    <ContentHTMLViewConnected contentId={contentId} onPressAnchor={routeLink} />
  );
};

HTMLContent.propTypes = {
  contentId: PropTypes.string,
};

export default HTMLContent;
