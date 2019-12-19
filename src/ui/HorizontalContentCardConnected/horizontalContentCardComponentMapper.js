import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  HorizontalDefaultCard,
  HorizontalHighlightCard,
} from '@apollosproject/ui-kit';

const horizontalContentCardComponentMapper = ({
  title,
  hyphenatedTitle,
  ...props
}) => {
  // map typename to the the card we want to render.
  switch (get(props, '__typename')) {
    case 'MediaContentItem':
    case 'WeekendContentItem':
    case 'ContentSeriesContentItem':
    case 'DevotionalContentItem':
      return <HorizontalHighlightCard title={hyphenatedTitle} {...props} />;
    default:
      return <HorizontalDefaultCard title={title} {...props} />;
  }
};

horizontalContentCardComponentMapper.propTypes = {
  hyphenatedTitle: PropTypes.string,
  title: PropTypes.string,
};

export default horizontalContentCardComponentMapper;
