/**
 * CurrentUser.js
 *
 * Author: Caleb Panza
 * Created: Apr 09, 2021
 *
 * Displays read-only information about the current user.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import { isEmpty } from 'lodash';
import { defaultProps } from 'recompose';

import { useCurrentUser } from 'hooks';

import {
  ModalCloseButton,
  styled,
  PaddedView,
  H3,
  withTheme,
  ThemeMixin,
  FlexedView,
  withMediaQuery,
} from '@apollosproject/ui-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { UserAvatarUpdate } from '@apollosproject/ui-connected';
import CoverImageBackground from '../../group-single/CoverImageBackground';
import {
  AddressCard,
  CampusCard,
  CommunicationPreferencesCard,
  ProfileDetailsCard,
} from '../components';

// :: Styles
// :: =====================
const BackgroundView = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.screen,
}))(View);

const CloseButtonSpacing = styled(({ theme }) => ({
  position: 'absolute',
  top: theme.sizing.baseUnit,
  right: theme.sizing.baseUnit,
}))(View);

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

const StyledTitle = styled(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const StyledH3 = styled({
  textAlign: 'center',
  alignItems: 'center',
})(H3);

const renderItem = ({ item }) => <FlexedView>{item}</FlexedView>;
const flatListData = [
  <CampusCard key="current-user-campus-card" />,
  <CommunicationPreferencesCard key="current-user-communication-preferences-card" />,
  <AddressCard key="current-user-address" />,
  <ProfileDetailsCard key="current-user-profile-details" />,
];

const CurrentUser = ({ numColumns }) => {
  const { firstName, lastName, campus, loading } = useCurrentUser();
  const isLoading = loading && isEmpty(firstName) && isEmpty(lastName);
  const coverImageSources = campus?.featuredImage?.uri || [];

  return (
    <CoverImageBackground isLoading={loading} source={coverImageSources}>
      <HeaderSpacing>
        <SafeAreaView forceInset={{ top: 'always', bottom: 'never' }}>
          <CloseButtonSpacing>
            <ModalCloseButton />
          </CloseButtonSpacing>

          <HeroAvatars>
            <ThemeMixin mixin={{ type: 'light' }}>
              <UserAvatarUpdate />
            </ThemeMixin>
          </HeroAvatars>

          <StyledTitle>
            <StyledH3 isLoading={isLoading} numberOfLines={2}>
              {`${firstName} ${lastName}`}
            </StyledH3>
          </StyledTitle>
        </SafeAreaView>
      </HeaderSpacing>

      <BackgroundView>
        <FlatList
          data={flatListData}
          numColumns={numColumns}
          renderItem={renderItem}
        />
      </BackgroundView>
    </CoverImageBackground>
  );
};

CurrentUser.propTypes = {
  numColumns: PropTypes.number,
};
CurrentUser.defaultProps = {
  numColumns: 1,
};

const CurrentUserNumColumns = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  defaultProps({ numColumns: 1 }),
  defaultProps({ numColumns: 2 })
)(CurrentUser);

export default CurrentUserNumColumns;
