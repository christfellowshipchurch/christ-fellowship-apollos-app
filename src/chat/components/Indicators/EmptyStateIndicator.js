import React from 'react';
import { UIText } from '@apollosproject/ui-kit';

const EmptyStateIndicator = ({ listType }) => {
  switch (listType) {
    case 'channel':
      return <UIText>You have no channels currently</UIText>;
    case 'message':
      return null;
    default:
      return <UIText>No items exist</UIText>;
  }
};

export default EmptyStateIndicator;
