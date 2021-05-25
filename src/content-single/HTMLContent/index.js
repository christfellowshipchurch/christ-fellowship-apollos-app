import React from 'react';
import PropTypes from 'prop-types';

import HTMLView from '@apollosproject/ui-htmlview';
import { ContentHTMLViewConnected } from '@apollosproject/ui-connected';
import { isEmpty } from 'lodash';
import { ItemSeparatorComponent } from '../ContentBody';
import { useLinkRouter } from '../../hooks';

const ConditionalRender = (props) => {
  const { children, isLoading } = props;

  if (isEmpty(children) && !isLoading) return null;

  return (
    <ItemSeparatorComponent>
      <HTMLView {...props} />
    </ItemSeparatorComponent>
  );
};

ConditionalRender.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
    PropTypes.string,
    PropTypes.element,
  ]),
};

const HTMLContent = ({ contentId }) => {
  const { routeLink } = useLinkRouter();

  return (
    <ContentHTMLViewConnected
      contentId={contentId}
      onPressAnchor={routeLink}
      Component={ConditionalRender}
    />
  );
};

HTMLContent.propTypes = {
  contentId: PropTypes.string,
};

export default HTMLContent;
