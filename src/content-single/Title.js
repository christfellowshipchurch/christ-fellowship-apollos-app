import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';
import { styled, H3, BodyText } from '@apollosproject/ui-kit';

import GET_CONTENT_ITEM from './getContentItem';

const TitleSpacer = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit,
}))(View);

const Title = ({ contentId, isLoading }) => {
  const { data, loading } = useQuery(GET_CONTENT_ITEM, {
    variables: { itemId: contentId },
  });

  const title = get(data, 'node.title', '');
  const somethingIsLoading = loading || isLoading;
  const theTitleExists = title && title !== '';
  const showLoadingIndicator = somethingIsLoading && !theTitleExists;

  return (
    <TitleSpacer>
      <H3 isLoading={showLoadingIndicator}>{get(data, 'node.title', '')}</H3>
      <BodyText isLoading={showLoadingIndicator}>
        {get(data, 'node.summary', '')}
      </BodyText>
    </TitleSpacer>
  );
};

Title.propTypes = {
  contentId: PropTypes.string,
  isLoading: PropTypes.bool,
};

Title.defaultProps = {
  contentId: '',
  isLoading: false,
};

export default Title;
