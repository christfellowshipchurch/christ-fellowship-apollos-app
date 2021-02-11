import React from 'react';
import PropTypes from 'prop-types';

import { ContentHTMLViewConnected } from '@apollosproject/ui-connected';
import { ItemSeparatorComponent } from '../UniversalContentItem';
import { useLinkRouter } from '../../hooks';

const HTMLContent = ({ contentId }) => {
  const { routeLink } = useLinkRouter();

  return (
    <ItemSeparatorComponent>
      <ContentHTMLViewConnected
        contentId={contentId}
        onPressAnchor={routeLink}
      />
    </ItemSeparatorComponent>
  );
};

HTMLContent.propTypes = {
  contentId: PropTypes.string,
};

export default HTMLContent;
