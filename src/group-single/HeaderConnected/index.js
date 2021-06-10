import React from 'react';
import { useQuery } from '@apollo/client';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Color from 'color';
import { SafeAreaView } from 'react-native-safe-area-context';

import LinearGradient from 'react-native-linear-gradient';
import {
  styled,
  PaddedView,
  H3,
  H5,
  withTheme,
  Avatar,
} from '@apollosproject/ui-kit';

import { useCurrentUser } from '../../hooks';

import EditGroupButton from '../EditGroupButton';

import GET_HEADER from './getHeader';

const HeaderSpacing = withTheme(({ theme }) => ({
  colors: [
    Color(theme.colors.background.screen)
      .alpha(0)
      .string(),
    theme.colors.background.screen,
  ],
  style: { paddingTop: theme.sizing.baseUnit * 2 },
}))(LinearGradient);

const HeroAvatars = styled(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
}))(PaddedView);

const HeroAvatarSpacing = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 0.5,
  paddingBottom: 0,
}))(View);

const StyledTitle = styled(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const StyledH3 = styled({
  textAlign: 'center',
  alignItems: 'center',
})(H3);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.darkTertiary,
  textAlign: 'center',
}))(H5);

const HeaderConnected = ({ id, onEditGroupPress }) => {
  const { id: currentUserId } = useCurrentUser();

  const { data, loading } = useQuery(GET_HEADER, {
    variables: { groupId: id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  const content = get(data, 'node', {});
  const leaders = get(content, 'leaders.edges', []);
  const avatars = leaders.map(({ node }) => node);
  const isGroupLeader = Boolean(
    leaders.find((leader) => get(leader, 'node.id') === currentUserId)
  );
  // const canEditGroup = isGroupLeader;
  const canEditGroup = false;

  return (
    <HeaderSpacing>
      <SafeAreaView forceInset={{ top: 'always', bottom: 'never' }}>
        {avatars.length > 0 && (
          <HeroAvatars>
            {avatars.map(({ id: personId, photo }) => (
              <HeroAvatarSpacing key={personId}>
                <Avatar source={photo} themeSize={65} />
              </HeroAvatarSpacing>
            ))}
          </HeroAvatars>
        )}

        <StyledTitle>
          <StyledH3 isLoading={loading && !content.title} numberOfLines={2}>
            {content.title}
          </StyledH3>
          {!loading &&
            !!content.groupType && (
              <StyledH5 numberOfLines={2}>{content.groupType}</StyledH5>
            )}
          {canEditGroup && <EditGroupButton onPress={onEditGroupPress} />}
        </StyledTitle>
      </SafeAreaView>
    </HeaderSpacing>
  );
};

HeaderConnected.propTypes = {
  id: PropTypes.string,
  onEditGroupPress: PropTypes.func,
};

export default HeaderConnected;
