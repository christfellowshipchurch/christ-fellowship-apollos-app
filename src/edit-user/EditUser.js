import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
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
  Switch,
} from '../ui/inputs';
import { useForm } from '../hooks';
import ChangeAvatar from './ChangeAvatar';

import { GET_FIELD_OPTIONS } from './queries';

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

// This component is made to be able to edit ANY user profile
// Currently, we only have the need to edit Current User,
//  but this component is prepared and ready to work with
//  editing other people's profiles as well.
const EditUser = ({
  navigation,
  loading: userLoading,
  error: userError,
  address,
  campus,
  birthDate,
  phoneNumber,
  email,
  firstName,
  lastName,
  gender,
  updateProfile,
  communicationPreferences: { allowSMS, allowEmail } = {},
}) => {
  const {
    loading: optionsLoading,
    error: optionsError,
    data: optionData,
  } = useQuery(GET_FIELD_OPTIONS, { fetchPolicy: 'cache-and-network' });
  const { values, setValue } = useForm({
    defaultValues: {
      ...address,
      campus,
      birthDate,
      phoneNumber,
      email,
      firstName,
      lastName,
      gender,
      allowSMS,
      allowEmail,
    },
  });

  const loading = userLoading || optionsLoading;
  const error = userError || optionsError;
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
              <TouchableScale
                onPress={() => updateProfile(values)}
                disabled={loading}
              >
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
              displayValue={values.campus.name}
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
              onChangeText={(newStreet1) => setValue('street1', newStreet1)}
              icon="home"
              disabled={disabled}
            />
            <TextInput
              label="City"
              value={values.city}
              onChangeText={(newCity) => setValue('city', newCity)}
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
              {get(optionData, 'stateOptions', []).map((s) => (
                <PickerItem label={s} value={s} key={s} />
              ))}
            </Picker>
            <TextInput
              label="Zip Code"
              value={get(values, 'postalCode', '').substring(0, 5)}
              onChangeText={(newPostalCode) =>
                setValue('postalCode', newPostalCode)
              }
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
              onChange={(newGender) => setValue('gender', newGender)}
              disabled={disabled}
            >
              {get(optionData, 'genderOptions', []).map((g) => (
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

          <FieldContainer>
            <H4>Communication Preferences</H4>
            {!!phoneNumber &&
              phoneNumber !== '' && (
                <Switch
                  icon="comment-lines"
                  label={`Allow Text Notifications`}
                  value={values.allowSMS}
                  disabled={loading}
                  onValueChange={(value) => {
                    setValue('allowSMS', value);
                  }}
                />
              )}

            {!!email &&
              email !== '' && (
                <Switch
                  icon="envelope-open-text"
                  label={`Allow Email Notifications`}
                  value={values.allowEmail}
                  disabled={loading}
                  onValueChange={(value) => {
                    setValue('allowEmail', value);
                  }}
                />
              )}
          </FieldContainer>
        </ContentContainer>
      </ScrollView>
    </BackgroundView>
  );
};

EditUser.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  error: PropTypes.bool,
  address: PropTypes.shape({
    street1: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
  }),
  campus: PropTypes.shape({
    name: PropTypes.string,
    featuredImage: PropTypes.shape({
      uri: PropTypes.string,
    }),
  }),
  birthDate: PropTypes.string,
  phoneNumber: PropTypes.string,
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  gender: PropTypes.string,
  updateProfile: PropTypes.func.isRequired,
};

EditUser.defaultProps = {
  loading: false,
  error: null,
  address: {
    street1: '',
    city: '',
    state: '',
    postalCode: '',
  },
  campus: {
    name: '',
    featuredImage: { uri: '' },
  },
  birthDate: '',
  phoneNumber: '',
  email: '',
  firstName: '',
  lastName: '',
  gender: '',
};

export default EditUser;
