import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';

import { View } from 'react-native';
import {
  styled,
  BodyText,
  withTheme,
  H4,
  HorizontalTileFeed,
  InlineActivityIndicator,
  UIText,
  Touchable,
  ConnectedImage,
  Icon,
} from '@apollosproject/ui-kit';

import GET_MEMBERS from './getMembers';

export const MemberCard = styled(({ theme }) => ({
  width: 80,
  flex: 1,
  margin: theme.sizing.baseUnit / 2,
  marginBottom: theme.sizing.baseUnit * 0.75,
  alignItems: 'center',
}))(View);

export const MemberImage = styled({
  borderRadius: 10,
  width: 80,
  height: 100,
})(ConnectedImage);

export const MemberImageWrapper = styled({
  borderRadius: 10,
  width: 80,
  height: 100,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
})(View);

export const PlaceholderIcon = withTheme(({ theme: { colors } = {} }) => ({
  fill: colors.paper,
  name: 'avatarPlacholder',
  size: 60,
}))(Icon);

export const PlaceholderWrapper = styled(({ theme }) => ({
  borderRadius: 10,
  width: 80,
  height: 100,
  backgroundColor: theme.colors.lightSecondary,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const StyledHorizontalTileFeed = withTheme(({ theme }) => ({
  style: {
    marginTop: theme.sizing.baseUnit * -1.25,
    paddingBottom: theme.sizing.baseUnit,
    zIndex: 1,
  },
  snapToInterval: 80 + theme.sizing.baseUnit,
}))(HorizontalTileFeed);

const StyledH4 = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
}))(H4);

const ActionText = withTheme(({ theme }) => ({
  bold: true,
  style: {
    padding: theme.sizing.baseUnit, // note : hack for increasing the active area of the Touchable
    color: theme.colors.primary,
    fontSize: 12,
  },
}))(UIText);

const HeaderSpacing = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}))(View);

const StyledActivityIndicator = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
}))(InlineActivityIndicator);

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

const HorizontalMembersFeedPreview = ({ id }) => {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_MEMBERS, {
    variables: {
      groupId: id,
      first: 5,
      isLeader: false,
    },
    skip: !id || id === '',
    fetchPolicy: 'cache-and-network',
  });

  const renderMember = ({ item }) => {
    const photo = get(item, 'photo', {});
    const name = get(item, 'nickName', '') || get(item, 'firstName', '');
    return (
      <MemberCard>
        {photo && photo.uri ? (
          <MemberImageWrapper>
            <MemberImage // eslint-disable-line react-native/no-inline-styles
              source={photo}
              minAspectRatio={1}
              maxAspectRatio={1}
              // Sets the ratio of the placeholder
              forceRatio={1}
              // No ratios are respected without this
              maintainAspectRatio
            />
          </MemberImageWrapper>
        ) : (
          <PlaceholderWrapper>
            <PlaceholderIcon isLoading={false} />
          </PlaceholderWrapper>
        )}

        <BodyText numberOfLines={1}>{name}</BodyText>
      </MemberCard>
    );
  };

  const members = mapEdges(data);

  if (error && !loading && !members) return null;

  return (
    <View>
      <HeaderSpacing>
        <StyledH4>Members</StyledH4>
        {loading ? (
          <StyledActivityIndicator />
        ) : (
          <Touchable
            onPress={() => navigation.navigate('GroupMembersFeed', { id })}
          >
            <ActionText>See All</ActionText>
          </Touchable>
        )}
      </HeaderSpacing>
      <StyledHorizontalTileFeed
        data={members}
        isLoading={members.length === 0 && loading}
        loadingStateObject={loadingStateObject}
        renderItem={renderMember}
        scrollEnabled={false}
      />
    </View>
  );
};

HorizontalMembersFeedPreview.propTypes = {
  id: PropTypes.string.isRequired,
};

export default HorizontalMembersFeedPreview;
