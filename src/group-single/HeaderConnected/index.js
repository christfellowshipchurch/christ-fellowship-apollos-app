import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Color from 'color';
import { SafeAreaView } from 'react-navigation';

import LinearGradient from 'react-native-linear-gradient';
import {
  styled,
  PaddedView,
  H3,
  H5,
  withTheme,
  Avatar,
} from '@apollosproject/ui-kit';

import EditGroupButton from '../EditGroupButton';

import GET_HEADER from './getHeader';

const HeaderSpacing = withTheme(({ theme }) => ({
  colors: [
    Color(theme.colors.background.paper)
      .alpha(0)
      .string(),
    theme.colors.background.paper,
  ],
  style: { paddingTop: theme.sizing.baseUnit * 2 },
}))(LinearGradient);

const EditContainer = styled(({ theme }) => ({
  position: 'absolute',
  top: -(theme.sizing.baseUnit / 2),
  left: theme.sizing.baseUnit,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
}))(View);

const HeroAvatars = styled(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
}))(PaddedView);

const HeroAvatarSpacing = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 0.5,
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

const HeaderConnected = ({ id }) => {
  const { data, loading } = useQuery(GET_HEADER, {
    variables: { groupId: id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  const content = get(data, 'node', {});
  const avatars = get(content, 'leaders.edges', []).map(({ node }) => node);

  return (
    <HeaderSpacing>
      <SafeAreaView forceInset={{ top: 'always', bottom: 'never' }}>
        <PaddedView>
          <EditContainer>
            <EditGroupButton />
          </EditContainer>
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
          </StyledTitle>
        </PaddedView>
      </SafeAreaView>
    </HeaderSpacing>
  );
};

HeaderConnected.propTypes = {
  id: PropTypes.string,
};

export default HeaderConnected;
