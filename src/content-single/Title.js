import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';

import { H3, BodyText } from '@apollosproject/ui-kit';
import { ItemSeparatorComponent } from './ContentBody';
import { CONTENT_FRAGMENT } from './getContentItem';

const GET_TITLE = gql`
  query getTitle($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ...ContentFragment
    }
  }

  ${CONTENT_FRAGMENT}
`;

const Title = ({ nodeId }) => {
  const skip = !nodeId || isEmpty(nodeId);
  const { data, loading } = useQuery(GET_TITLE, {
    variables: { nodeId },
    skip,
  });

  const title = data?.node?.title;
  const summary = data?.node?.summary;
  const theTitleExists = title && title !== '';
  const somethingIsLoading = loading && !theTitleExists;
  const showLoadingIndicator = somethingIsLoading && !theTitleExists;

  if (!theTitleExists) return null;

  return (
    <ItemSeparatorComponent>
      <H3 isLoading={showLoadingIndicator}>{title}</H3>
      <BodyText isLoading={showLoadingIndicator}>{summary}</BodyText>
    </ItemSeparatorComponent>
  );
};

Title.propTypes = {
  nodeId: PropTypes.string,
};

Title.defaultProps = {};

export default Title;
