import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import HTMLView from '@apollosproject/ui-htmlview';
import { ErrorCard } from '@apollosproject/ui-kit';

import getContentItemContent from './getContentItemContent';

const HTMLContent = ({ contentId }) => {
  if (!contentId) return <HTMLView isLoading />;

  return (
    <Query query={getContentItemContent} variables={{ contentId }}>
      {({ data: { node: { htmlContent } = {} } = {}, loading, error }) => {
        if (error) return <ErrorCard error={error} />;
        return (
          <HTMLView isLoading={!htmlContent && loading}>{htmlContent}</HTMLView>
        );
      }}
    </Query>
  );
};

HTMLContent.propTypes = {
  contentId: PropTypes.string,
};

export default HTMLContent;
