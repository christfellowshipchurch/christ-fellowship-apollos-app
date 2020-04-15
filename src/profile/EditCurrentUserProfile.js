import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import Color from 'color';

import { SafeAreaView } from 'react-navigation';
import {
  GradientOverlayImage,
  styled,
  BodyText,
  ActivityIndicator,
  ErrorCard,
  H4,
  H6,
  withTheme,
  ThemeMixin,
  TouchableScale,
  BackgroundView,
  FlexedView,
} from '@apollosproject/ui-kit';
import {
  TextInput,
  DateInput,
  Picker,
  PickerItem,
  Radio,
  RadioButton,
  InputWrapper,
} from '../ui/inputs';
import { useCurrentUser, useForm } from '../hooks';
import NavigationHeader from '../content-single/NavigationHeader';
import ChangeAvatar from './ChangeAvatar';

const FeaturedImage = withTheme(({ theme }) => ({
  overlayColor: theme.colors.black,
  overlayType: 'gradient-user-profile',
  style: StyleSheet.absoluteFill,
}))(GradientOverlayImage);

const Layout = styled(({ theme }) => ({
  overflow: 'hidden',
}))(View);

const AvatarContainer = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const SaveButton = styled(({ theme, disabled }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: 3,
  fontSize: 12,
  paddingHorizontal: 25,
  fontWeight: 'bold',
  marginVertical: theme.sizing.baseUnit,
  opacity: disabled ? 0.5 : 1,
}))(BodyText);

// Container for the Fields under the
export const ContentContainer = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 1.5,
  backgroundColor: theme.colors.transparent,
}))(View);

// Read Only Fields that show on the Profile
export const FieldContainer = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit * 1.5,
  marginVertical: theme.sizing.baseUnit * 0.75,
}))(View);

const Overlay = styled(({ theme }) => ({
  alignContent: 'center',
  justifyContent: 'center',
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: Color(theme.colors.background.screen).fade(0.75),
  top: 0,
  left: 0,
  zIndex: 1,
}))(FlexedView);

const EditCurrentUser = ({ navigation }) => {
  const { values, setValues } = useForm();
  const {
    loading,
    error,
    address,
    campus,
    birthDate,
    phoneNumber,
    email,
    firstName,
    lastName,
    gender,
    updateProfile, // TODO : enable editing
  } = useCurrentUser();

  const setValue = () => null;

  useEffect(
    () =>
      setValues({
        campus: get(campus, 'name', ''),
        birthDate,
        phoneNumber,
        email,
        firstName,
        lastName,
        gender,
        ...address,
      }),
    [loading]
  );

  const featuredImage = get(campus, 'featuredImage.uri', null);

  if (loading)
    return (
      <BackgroundView>
        <StatusBar hidden />
        <ActivityIndicator />
      </BackgroundView>
    );

  if (error) return <ErrorCard />;

  const disabled = false;
  const states = [];
  const genderList = [];

  return (
    <BackgroundView>
      <StatusBar hidden />
      <ThemeMixin mixin={{ type: 'dark' }}>
        <Layout>
          <FeaturedImage
            isLoading={!featuredImage && loading}
            source={[{ uri: featuredImage }]}
          />
          <SafeAreaView>
            <AvatarContainer>
              <ChangeAvatar />
              <H4>{`${firstName} ${lastName}`}</H4>
              <TouchableScale onPress={() => null} disabled={loading}>
                <SaveButton disabled={loading}>Save</SaveButton>
              </TouchableScale>
            </AvatarContainer>
          </SafeAreaView>
        </Layout>
      </ThemeMixin>
      <ScrollView>
        <ContentContainer>
          {disabled && (
            <Overlay>
              <ActivityIndicator />
            </Overlay>
          )}

          <FieldContainer>
            <H4>Campus</H4>
            <InputWrapper
              displayValue={values.campus}
              icon="church"
              actionIcon="angle-right"
              handleOnPress={() => navigation.navigate('Location')}
              disabled={disabled}
            />
          </FieldContainer>

          <FieldContainer>
            <H4>Home Address</H4>
            <TextInput
              label="Street Address"
              value={values.street1}
              setValueText={(text) => setValue('street1', text)}
              icon="home"
              disabled={disabled}
            />
            <TextInput
              label="City"
              value={values.city}
              setValueText={(text) => setValue('city', text)}
              hideIcon
              disabled={disabled}
            />
            <Picker
              label="State"
              value={values.state}
              displayValue={values.state}
              onValueChange={(newState) => setValue('state', newState)}
              hideIcon
              disabled={disabled}
            >
              {states.map((n, i) => (
                <PickerItem label={n.value} value={n.value} key={i} />
              ))}
            </Picker>
            <TextInput
              label="Zip Code"
              value={get(values, 'postalCode', '').substring(0, 5)}
              setValueText={(text) => setValue('postalCode', text)}
              hideIcon
              disabled={disabled}
            />
          </FieldContainer>

          <FieldContainer>
            <H4>Gender</H4>
            <Radio
              label=""
              type="radio"
              value={values.gender}
              setValue={(newGender) => setValue('gender', newGender)}
              disabled={disabled}
            >
              {genderList.map((g) => (
                <RadioButton key={g} value={g} label={g} underline={false} />
              ))}
            </Radio>
          </FieldContainer>

          <FieldContainer>
            <H4>Birthday</H4>
            <DateInput
              label=""
              value={
                moment(values.birthDate).isValid()
                  ? moment(values.birthDate).format('MMM D, YYYY')
                  : ''
              }
              displayValue={
                moment(values.birthDate).isValid()
                  ? moment(values.birthDate).format('MMM D, YYYY')
                  : ''
              }
              onConfirm={(newBirthDate) => setValue('birthDate', newBirthDate)}
              disabled={disabled}
            />
          </FieldContainer>
        </ContentContainer>
      </ScrollView>
    </BackgroundView>
  );
};

// TODO : Fix the navigation
EditCurrentUser.navigationOptions = {
  headerMode: 'float',
  headerTransitionPreset: 'fade-in-place',
  headerTransparent: true,
  header: NavigationHeader,
};

EditCurrentUser.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default EditCurrentUser;
