import React from 'react';
import { Platform, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  styled,
  FlexedView,
  Avatar,
  H6,
  withTheme,
} from '@apollosproject/ui-kit';

import { GET_AUTHOR } from './queries';

const DATE_FORMAT = 'MMMM D, YYYY';

const AuthorContainer = styled(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginTop: theme.sizing.baseUnit * 0.5,
  marginBottom: theme.sizing.baseUnit,
}))(View);

const TextContainer = styled(({ theme }) => ({
  justifyContent: 'center',
  paddingLeft: theme.sizing.baseUnit * 0.5,
}))(FlexedView);

const StyledH6 = styled(({ theme, color = 'primary' }) => ({
  color: theme.colors.text[color],
}))(H6);

const StyledAvatar = withTheme(({ theme }) => ({
  containerStyle: {
    ...Platform.select(theme.shadows.default),
  },
}))(Avatar);

const Author = ({ contentId }) => {
  const { data: { node } = {}, loading, error } = useQuery(GET_AUTHOR, {
    variables: { id: contentId },
    fetchPolicy: 'cache-and-network',
  });
  const authorImageSources = get(node, 'author.photo', []);
  const firstName = get(node, 'author.firstName', '');
  const lastName = get(node, 'author.lastName', '');
  const authorName = `${firstName} ${lastName}`;
  const publishDate =
    get(node, 'publishDate', '') !== ''
      ? moment(node.publishDate).format(DATE_FORMAT)
      : moment().format(DATE_FORMAT);

  if (error || (!loading && firstName === '' && lastName === '')) return null;

  return (
    <AuthorContainer>
      <StyledAvatar
        isLoading={loading}
        source={authorImageSources}
        size="small"
      />
      <TextContainer>
        <StyledH6 numberOfLines={2} ellipsizeMode="tail" isLoading={loading}>
          {authorName}
        </StyledH6>

        <StyledH6
          numberOfLines={2}
          ellipsizeMode="tail"
          isLoading={loading}
          color="tertiary"
        >
          {`${publishDate}`}
        </StyledH6>
      </TextContainer>
    </AuthorContainer>
  );
};

Author.propTypes = {
  contentId: PropTypes.string,
};

export default Author;
