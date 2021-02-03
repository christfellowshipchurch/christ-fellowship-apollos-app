/**
 * MembersFeedConnected.js
 *
 * Author: Caleb Panza
 * Created: Feb 03, 2021
 *
 * Vertically scrolling list of Group Members and their Profile Pictures
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { get, set, uniqBy } from 'lodash';

import { FlatList } from 'react-native';
import {
  BodyText,
  withTheme,
  styled,
  FeedView,
  Icon,
  Card,
  CardImage,
  FlexedView,
} from '@apollosproject/ui-kit';

import GET_MEMBERS from './getMembers';

const Image = withTheme(({ theme }) => ({
  forceRatio: 1,
  imageStyle: { aspectRatio: 1 },
}))(CardImage);

export const PlaceholderIcon = withTheme(({ theme: { colors } = {} }) => ({
  fill: colors.paper,
  name: 'avatar',
  size: 60,
}))(Icon);

const StyledFeedView = withTheme(({ theme }) => ({
  style: {
    paddingBottom: theme.sizing.baseUnit,
    zIndex: 1,
  },
}))(FlatList);

const MemberLayout = styled(({ theme }) => ({
  alignItems: 'center',
  marginVertical: theme.sizing.baseUnit,
}))(FlexedView);

const loadingStateObject = {
  id: 'fake_id',
  firstName: '',
  lastName: '',
  photo: [],
};

const mapEdges = (data) =>
  get(data, 'node.people.edges', []).map(({ node }) => ({
    ...node,
  }));

const MembersFeedConnected = ({ id }) => {
  const { loading, error, data, fetchMore, variables } = useQuery(GET_MEMBERS, {
    variables: {
      groupId: id,
      first: 14,
      after: null,
      isLeader: false,
    },
    skip: !id || id === '',
    fetchPolicy: 'cache-and-network',
  });

  const renderMember = ({ item }) => {
    const photo = get(item, 'photo', {});
    const givenName = get(item, 'nickName', '') || get(item, 'firstName', '');
    const familyName = get(item, 'lastName', '');

    return get(item, 'emptyItem') ? (
      <FlexedView />
    ) : (
      <MemberLayout>
        <Card>
          {photo && photo.uri ? (
            <Image // eslint-disable-line react-native/no-inline-styles
              source={photo}
              minAspectRatio={1}
              maxAspectRatio={1}
              // Sets the ratio of the placeholder
              forceRatio={1}
              // No ratios are respected without this
              maintainAspectRatio
            />
          ) : (
            <PlaceholderIcon isLoading={false} />
          )}
        </Card>
        <BodyText
          numberOfLines={1}
          bold
        >{`${givenName} ${familyName}`}</BodyText>
      </MemberLayout>
    );
  };

  const members = mapEdges(data);

  if (error && !loading && !members) return null;

  return (
    <StyledFeedView
      data={
        members.length % 2 === 0
          ? members
          : [
              ...members,
              {
                emptyItem: true,
              },
            ]
      }
      numColumns={2}
      isLoading={members.length === 0 && loading}
      loadingStateObject={loadingStateObject}
      renderItem={renderMember}
      onEndReachedThreshold={0.7}
      onEndReached={() => {
        const pageInfoPath = `node.people.pageInfo`;
        const edgePath = `node.people.edges`;

        const after = get(data, `${pageInfoPath}.endCursor`);
        if (!after) return;

        fetchMore({
          variables: { ...variables, after },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const result = fetchMoreResult;
            const originalPeople = get(previousResult, edgePath, []);
            const newPeople = get(result, edgePath, []);

            set(
              result,
              edgePath,
              uniqBy([...originalPeople, ...newPeople], 'node.id')
            );

            return result;
          },
        });
      }}
    />
  );
};

MembersFeedConnected.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MembersFeedConnected;
