import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { get, isEmpty } from 'lodash';
import moment from 'moment';

import { Platform } from 'react-native';
import {
  styled,
  FlexedView,
  Avatar,
  H6,
  withTheme,
} from '@apollosproject/ui-kit';
import { ItemSeparatorComponent } from '../UniversalContentItem';

import { GET_AUTHOR } from './queries';

const DATE_FORMAT = 'MMMM D, YYYY';

const AuthorContainer = styled(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
}))(ItemSeparatorComponent);

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
    skip: !contentId || contentId === '',
  });
  const authorImageSources = get(node, 'author.photo', []);
  const firstName = get(node, 'author.firstName', '');
  const lastName = get(node, 'author.lastName', '');
  const authorName = `${firstName} ${lastName}`;
  const publishDate =
    get(node, 'publishDate', '') !== ''
      ? moment(node.publishDate).format(DATE_FORMAT)
      : moment().format(DATE_FORMAT);

  if (isEmpty(firstName) && isEmpty(lastName)) return null;

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
