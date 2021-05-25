import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H3, BodyText, styled } from '@apollosproject/ui-kit';
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

const StyledH3 = styled(({ topInset = 0 }) => ({
  paddingTop: topInset,
}))(H3);

const Title = ({ nodeId }) => {
  const skip = !nodeId || isEmpty(nodeId);
  const { data, loading } = useQuery(GET_TITLE, {
    variables: { nodeId },
    skip,
  });
  const { top } = useSafeAreaInsets();

  const title = data?.node?.title;
  const summary = data?.node?.summary;
  const coverImage = data?.node?.coverImage;
  const theTitleExists = title && title !== '';
  const somethingIsLoading = loading && !theTitleExists;
  const showLoadingIndicator = somethingIsLoading && !theTitleExists;

  if (!theTitleExists) return null;

  return (
    <ItemSeparatorComponent>
      <StyledH3
        topInset={!coverImage ? top : 0}
        isLoading={showLoadingIndicator}
      >
        {title}
      </StyledH3>
      {!isEmpty(summary) && (
        <BodyText isLoading={showLoadingIndicator}>{summary}</BodyText>
      )}
    </ItemSeparatorComponent>
  );
};

Title.propTypes = {
  nodeId: PropTypes.string,
};

Title.defaultProps = {};

export default Title;
