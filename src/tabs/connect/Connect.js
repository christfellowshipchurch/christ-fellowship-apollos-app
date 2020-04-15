import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import Color from 'color';

import {
  GradientOverlayImage,
  Avatar,
  styled,
  BodyText,
  Card,
  CardContent,
  ActivityIndicator,
  ErrorCard,
  H4,
  H6,
  withTheme,
  ThemeMixin,
  TouchableScale,
} from '@apollosproject/ui-kit';

import {
  navigationOptions,
  BackgroundView,
  NavigationBackground,
  HEADER_OFFSET,
} from '../navigation';
import { CURRENT_USER } from './queries';
import ProfileActionBar from './ProfileActionBar';

const FeaturedImage = withTheme(({ theme }) => ({
  overlayColor: theme.colors.black,
  overlayType: 'gradient-user-profile',
  style: StyleSheet.absoluteFill,
}))(GradientOverlayImage);

const Layout = styled(({ theme }) => ({
  overflow: 'hidden',
}))(View);

const AvatarContainer = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  paddingBottom: theme.sizing.baseUnit,
  paddingTop: HEADER_OFFSET + theme.sizing.baseUnit * 2,
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const StyledAvatar = styled(({ theme }) => ({
  ...Platform.select(theme.shadows.default),
}))(Avatar);

const StyledBodyText = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(BodyText);

const Divider = styled(({ theme }) => ({
  height: StyleSheet.hairlineWidth,
  backgroundColor: Color(
    Color(theme.colors.screen).isLight()
      ? theme.colors.black
      : theme.colors.white
  ).fade(0.1),
  opacity: 0.15,
  width: '70%',
  marginVertical: theme.sizing.baseUnit,
}))(View);

const CardTitle = styled(({ theme }) => ({
  textTransform: 'uppercase',
  color: theme.colors.text.tertiary,
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(H6);

const Name = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
}))(H4);

const EditButton = styled(({ theme, editMode, disabled }) => ({
  borderColor: editMode ? theme.colors.primary : theme.colors.white,
  backgroundColor: editMode ? theme.colors.primary : theme.colors.transparent,
  borderRadius: 3,
  borderWidth: 1,
  fontSize: 12,
  paddingHorizontal: 25,
  fontWeight: 'bold',
  marginVertical: theme.sizing.baseUnit,
  opacity: disabled ? 0.5 : 1,
}))(BodyText);

const Connect = ({ navigation }) => {
  const { loading, error, data } = useQuery(CURRENT_USER, {
    fetchPolicy: 'cache-and-network',
  });

  const profile = get(data, 'currentUser.profile', null);
  const featuredImage = get(profile, 'campus.featuredImage.uri', null);

  if (loading)
    return (
      <BackgroundView>
        <ActivityIndicator />
      </BackgroundView>
    );

  if (error) return <ErrorCard />;

  const city =
    get(profile, 'address.city', '') !== '' ? `${profile.address.city},` : '';
  const address = `${get(profile, 'address.street1', '')} ${city} ${get(
    profile,
    'address.state',
    ''
  )} ${get(profile, 'address.postalCode', '').substring(0, 5)}`;
  const campus = get(profile, 'campus.name', '');

  return (
    <BackgroundView>
      <ThemeMixin mixin={{ type: 'dark' }}>
        <Layout>
          <FeaturedImage
            isLoading={!featuredImage && loading}
            source={[{ uri: featuredImage }]}
          />
          <AvatarContainer>
            <StyledAvatar size="large" source={get(profile, 'photo', null)} />
            <Name>{`${profile.firstName} ${profile.lastName}`}</Name>
            {campus && campus !== '' && <H6>{campus}</H6>}
            <TouchableScale onPress={() => null} disabled={loading}>
              <EditButton disabled={loading}>Edit</EditButton>
            </TouchableScale>
          </AvatarContainer>
        </Layout>
      </ThemeMixin>
      <ProfileActionBar />
      <ScrollView>
        <Card>
          <CardContent>
            <CardTitle>My Info</CardTitle>
            <H4>Home Address</H4>
            <StyledBodyText>{address}</StyledBodyText>
            <Divider />

            <H4>Birthday</H4>
            <StyledBodyText>
              {moment(profile.birthDate).format('MMM D, YYYY')}
            </StyledBodyText>
            <Divider />

            <H4>Gender</H4>
            <StyledBodyText>{profile.gender}</StyledBodyText>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CardTitle>Contact Info</CardTitle>
            <H4>Phone Number</H4>
            <StyledBodyText>{profile.phoneNumber}</StyledBodyText>
            <Divider />

            <H4>Email</H4>
            <StyledBodyText>{profile.email}</StyledBodyText>
          </CardContent>
        </Card>
      </ScrollView>
    </BackgroundView>
  );
};

Connect.navigationOptions = ({ navigation, theme }) => ({
  ...navigationOptions,
  headerTitleStyle: {
    ...navigationOptions.headerTitleStyle,
    color: theme === 'dark' ? 'white' : 'black',
  },
  headerBackground: <NavigationBackground blur />,
  title: 'Profile',
});

Connect.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Connect;
