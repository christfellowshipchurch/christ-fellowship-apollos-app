import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import Color from 'color';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';
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
  withMediaQuery,
  UIText,
} from '@apollosproject/ui-kit';
import { UserAvatarUpdate } from '@apollosproject/ui-connected';
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
import { useForm, useCurrentUser } from '../hooks';

import { GET_FIELD_OPTIONS } from './queries';
import UpdatePushNotification from './UpdatePushNotification';

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
export const ContentContainer = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
  })),
  styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
    width: 500,
    alignSelf: 'center',
  }))
)(View);

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
  backgroundColor: Color(theme.colors.background.screen)
    .fade(0.75)
    .hex(),
  top: 0,
  left: 0,
  zIndex: 1,
}))(FlexedView);

const Disclaimer = styled(({ theme }) => ({
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontSize: 12,
  color: theme.colors.text.tertiary,
}))(UIText);

const pickerColorValue = new DynamicValue('black', 'white');

// This component is made to be able to edit ANY user profile
// Currently, we only have the need to edit Current User,
//  but this component is prepared and ready to work with
//  editing other people's profiles as well.
const EditUser = ({
  navigation,
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
  communicationPreferences: { allowSMS, allowEmail } = {},
  genderOptions,
  stateOptions,
}) => {
  const {
    updateProfileField,
    updateCommunicationPreference,
    updateAddress,
    loading: disabled,
  } = useCurrentUser();
  const [allowSMSToggle, setAllowSMSToggle] = useState(allowSMS);
  const [allowEmailToggle, setAllowEmailToggle] = useState(allowEmail);
  const { values, setValue } = useForm({
    defaultValues: {
      street1: get(address, 'street1', ''),
      city: get(address, 'city', ''),
      state: get(address, 'state', ''),
      postalCode: get(address, 'postalCode', ''),
    },
  });

  const handleAddressUpdate = () => {
    if (
      values.street1 &&
      values.street1 !== '' &&
      values.city &&
      values.city !== '' &&
      values.state &&
      values.state !== '' &&
      values.postalCode &&
      values.postalCode !== ''
    ) {
      updateAddress({
        variables: {
          address: values,
        },
      });
    }
  };
  const pickerColor = useDynamicValue(pickerColorValue);
  const featuredImage = get(campus, 'featuredImage.uri', null);

  if (loading && !firstName)
    return (
      <BackgroundView>
        <StatusBar hidden />
        <ActivityIndicator />
      </BackgroundView>
    );

  if (error) return <ErrorCard />;

  return (
    <BackgroundView>
      <StatusBar hidden />
      <KeyboardAvoidingView behavior={'padding'}>
        <ScrollView>
          <ThemeMixin mixin={{ type: 'dark' }}>
            <Layout>
              <FeaturedImage
                isLoading={!featuredImage && loading}
                source={[{ uri: featuredImage }]}
              />
              <SafeAreaView>
                <AvatarContainer>
                  <ThemeMixin mixin={{ type: 'light' }}>
                    <UserAvatarUpdate />
                  </ThemeMixin>

                  <H4>{`${firstName} ${lastName}`}</H4>
                  <TouchableScale
                    onPress={() => {
                      navigation.goBack(null);
                    }}
                    disabled={disabled}
                  >
                    <SaveButton disabled={disabled}>Done</SaveButton>
                  </TouchableScale>
                </AvatarContainer>
              </SafeAreaView>
            </Layout>
          </ThemeMixin>

          <ContentContainer>
            {disabled && (
              <Overlay>
                <ActivityIndicator />
              </Overlay>
            )}

            <FieldContainer>
              <H4>Campus</H4>
              <InputWrapper
                displayValue={campus.name}
                icon="campus"
                actionIcon="arrow-next"
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
                onBlur={handleAddressUpdate}
                icon="home"
                disabled={disabled}
                returnKeyType="done"
              />
              <TextInput
                label="City"
                value={values.city}
                onChangeText={(newCity) => setValue('city', newCity)}
                onBlur={handleAddressUpdate}
                hideIcon
                disabled={disabled}
                returnKeyType="done"
              />
              <Picker
                label="State"
                value={values.state}
                displayValue={values.state}
                onValueChange={(newState) => setValue('state', newState)}
                onBlur={() => handleAddressUpdate()}
                hideIcon
                disabled={disabled}
              >
                {stateOptions.map((s) => (
                  <PickerItem label={s} value={s} key={s} color={pickerColor} />
                ))}
              </Picker>
              <TextInput
                label="Zip Code"
                value={get(values, 'postalCode', '').substring(0, 5)}
                onChangeText={(newPostalCode) =>
                  setValue('postalCode', newPostalCode)
                }
                onBlur={handleAddressUpdate}
                hideIcon
                disabled={disabled}
                returnKeyType="done"
              />
            </FieldContainer>

            <FieldContainer>
              <H4>Gender</H4>
              <Radio
                label=""
                type="radio"
                value={gender}
                onChange={(newGender) => {
                  updateProfileField({
                    variables: {
                      profileField: { field: 'Gender', value: newGender },
                    },
                  });
                }}
                disabled={disabled}
              >
                {genderOptions.map((g) => (
                  <RadioButton key={g} value={g} label={g} underline={false} />
                ))}
              </Radio>
            </FieldContainer>

            <FieldContainer>
              <H4>Birthday</H4>
              {!!birthDate && (
                <DateInput
                  value={birthDate}
                  onConfirm={(newBirthDate) => {
                    updateProfileField({
                      variables: {
                        profileField: {
                          field: 'BirthDate',
                          value: newBirthDate,
                        },
                      },
                    });
                  }}
                  disabled={disabled}
                  maxYear={moment().year() - 13}
                />
              )}
              <Disclaimer>
                *You must be at least 13 years old to have an account.
              </Disclaimer>
            </FieldContainer>

            <FieldContainer>
              <H4>Communication Preferences</H4>
              {!!phoneNumber &&
                phoneNumber !== '' && (
                  <Switch
                    icon="message-bubble"
                    label={`Allow Text Notifications`}
                    value={allowSMSToggle}
                    disabled={loading}
                    onValueChange={(value) => {
                      updateCommunicationPreference({
                        variables: { type: 'SMS', allow: value },
                      });
                      setAllowSMSToggle(value);
                    }}
                  />
                )}

              {!!email &&
                email !== '' && (
                  <Switch
                    icon="envelope"
                    label={`Allow Email Notifications`}
                    value={allowEmailToggle}
                    disabled={loading}
                    onValueChange={(value) => {
                      updateCommunicationPreference({
                        variables: { type: 'Email', allow: value },
                      });
                      setAllowEmailToggle(value);
                    }}
                  />
                )}
              <UpdatePushNotification />
            </FieldContainer>
          </ContentContainer>
        </ScrollView>
      </KeyboardAvoidingView>
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
  communicationPreferences: PropTypes.shape({
    allowSMS: PropTypes.bool,
    allowEmail: PropTypes.bool,
  }),
  genderOptions: PropTypes.arrayOf(PropTypes.string),
  stateOptions: PropTypes.arrayOf(PropTypes.string),
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
  communicationPreferences: {
    allowSMS: false,
    allowEmail: false,
  },
  genderOptions: [],
  stateOptions: [],
};

const EditUserConnected = (props) => {
  const { data } = useQuery(GET_FIELD_OPTIONS, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <EditUser
      {...props}
      stateOptions={get(data, 'stateOptions', [])}
      genderOptions={get(data, 'genderOptions', [])}
    />
  );
};

export default EditUserConnected;
