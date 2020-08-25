import React from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { get } from 'lodash';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import moment from 'moment';
import Color from 'color';
import { withProps } from 'recompose';
import { UserAvatarConnected } from '@apollosproject/ui-connected';

import {
  styled,
  BodyText,
  Card,
  CardContent,
  ActivityIndicator,
  ErrorCard,
  H4,
  H6,
  withTheme,
  Icon,
  UIText,
  SideBySideView,
  withMediaQuery,
  PaddedView,
} from '@apollosproject/ui-kit';

import {
  navigationOptions,
  BackgroundView,
  HEADER_OFFSET,
  useHeaderScrollEffect,
  NavigationSpacer,
  HeaderRight,
} from '../../navigation';

import StatusBar from '../../ui/StatusBar';
import { useCurrentUser, useFeatureFlag } from '../../hooks';
import ProfileActionBar from './ProfileActionBar';
import Groups from './Groups';

import { CURRENT_USER } from './queries';

const CardLayout = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps({ Component: View }),
  withProps({ Component: SideBySideView })
)(({ Component, ...props }) => <Component {...props} />);

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

const Title = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
}))(H4);

const Subtitle = styled(({ theme }) => ({
  fontWeight: '400',
}))(H6);

const Flag = styled({
  flexDirection: 'row',
})(View);

const FlagMedia = styled(({ theme }) => ({}))(PaddedView);

const FlagContent = styled({
  justifyContent: 'center',
})(View);

const OffsetScrollView = styled({
  paddingTop: HEADER_OFFSET * 1.5, // Offset content enough to account for large custom header.
})(ScrollView);

const StyledHeaderRight = styled({
  height: '100%', // Pushes the bar icon to the top of header.
})(View);

const CheckBoxRowContainer = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.25,
  flexDirection: 'row',
  alignItems: 'center',
  opacity: 0.35,
}))(View);

const CheckBoxIcon = withTheme(({ theme, active }) => ({
  name: active ? 'checkbox-checked' : 'checkbox-unchecked',
  size: 16,
  fill: theme.colors.text.primary,
  style: {
    marginRight: theme.sizing.baseUnit * 0.25,
    opacity: 0.75,
  },
}))(Icon);

const CheckBoxRow = ({ active, type }) => (
  <CheckBoxRowContainer>
    <CheckBoxIcon active={active} />
    <UIText>{`${type} is ${active ? 'enabled' : 'disabled'}`}</UIText>
  </CheckBoxRowContainer>
);

CheckBoxRow.propTypes = {
  active: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

CheckBoxRow.defaultProps = {
  active: false,
};

const Connect = ({ navigation }) => {
  const {
    loading,
    error,
    address,
    birthDate,
    phoneNumber,
    email,
    gender,
    communicationPreferences: { allowSMS, allowEmail } = {},
  } = useCurrentUser();
  const { enabled } = useFeatureFlag({
    key: 'GROUPS',
  });
  const { scrollY } = useHeaderScrollEffect({ navigation });

  if (loading)
    return (
      <BackgroundView>
        <ActivityIndicator />
      </BackgroundView>
    );

  if (error) return <ErrorCard />;

  const city = get(address, 'city', '') !== '' ? `${address.city},` : '';
  const formattedAddress = `${get(address, 'street1', '')} ${city} ${get(
    address,
    'state',
    ''
  )} ${get(address, 'postalCode', '').substring(0, 5)}`;
  const hasPhoneNumber = !!phoneNumber && phoneNumber !== '';
  const hasEmail = !!email && email !== '';

  return (
    <BackgroundView>
      <StatusBar />
      <NavigationSpacer />
      <OffsetScrollView
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: { y: scrollY },
            },
          },
        ])}
      >
        {enabled ? <Groups navigation={navigation} /> : null}
        <ProfileActionBar />
        <CardLayout>
          <Card style={{ flex: 1 }}>
            <CardContent>
              <CardTitle>My Info</CardTitle>
              <H4>Home Address</H4>
              <StyledBodyText>{formattedAddress}</StyledBodyText>
              <Divider />

              <H4>Birthday</H4>
              <StyledBodyText>
                {moment(birthDate).format('MMM D, YYYY')}
              </StyledBodyText>
              <Divider />

              <H4>Gender</H4>
              <StyledBodyText>{gender}</StyledBodyText>
            </CardContent>
          </Card>

          <Card style={{ flex: 1 }}>
            <CardContent>
              <CardTitle>Contact Info</CardTitle>
              {hasPhoneNumber && (
                <>
                  <H4>Phone Number</H4>
                  <StyledBodyText>{phoneNumber}</StyledBodyText>
                  <CheckBoxRow active={allowSMS} type="Text messaging" />
                </>
              )}

              {hasPhoneNumber && hasEmail && <Divider />}

              {hasEmail && (
                <>
                  <H4>Email</H4>
                  <StyledBodyText>{email}</StyledBodyText>
                  <CheckBoxRow active={allowEmail} type="Email" />
                </>
              )}
            </CardContent>
          </Card>
        </CardLayout>
      </OffsetScrollView>
    </BackgroundView>
  );
};

Connect.navigationOptions = ({ navigation, ...props }) =>
  navigationOptions({
    navigation,
    ...props,
    title: 'Profile',
    headerStyle: { height: 110 }, // Magic Number: Has to be big enough to contain the user avatar, name, and campus in header.
    headerTitle: (
      <Flag>
        <FlagMedia>
          <UserAvatarConnected
            size={'medium'}
            buttonIcon={'settings'}
            onPressIcon={() => navigation.navigate('EditCurrentUser')}
          />
        </FlagMedia>
        <FlagContent>
          <Query query={CURRENT_USER}>
            {({
              data: {
                currentUser: {
                  profile: { firstName, lastName, campus } = {},
                } = {},
              } = {},
            }) => (
              <>
                <Title>{`${firstName} ${lastName}`}</Title>
                {campus &&
                  campus.name !== '' && <Subtitle>{campus.name}</Subtitle>}
              </>
            )}
          </Query>
        </FlagContent>
      </Flag>
    ),
    headerRight: navigation.getParam('nested') ? null : (
      <StyledHeaderRight>
        <HeaderRight />
      </StyledHeaderRight>
    ),
  });

Connect.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Connect;
