/**
 * EditProfileDetails.js
 *
 * Author: Caleb Panza
 * Created: Apr 09, 2021
 *
 * Edit the user's gender and birth date
 */

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser, useForm } from 'hooks';
import moment from 'moment';

import { View } from 'react-native';
import {
  Button,
  styled,
  RadioButton,
  UIText,
  H3,
} from '@apollosproject/ui-kit';
import {
  ProfileEntryFieldContainer,
  FieldLabel,
  RadioInput,
  RadioLabel,
} from '@apollosproject/ui-auth/src/styles';

import { DateInput } from 'ui/inputs';

// :: Constants
// :: ============================
const GENDER_OPTIONS = gql`
  query getGenderOptions {
    genderOptions
  }
`;

// :: Components
// :: ============================
const VerticalPadding = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit,
}))(View);

const Disclaimer = styled(({ theme }) => ({
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontSize: 12,
  color: theme.colors.text.tertiary,
}))(UIText);

// :: Styles
// :: ============================

const EditProfileDetails = () => {
  // return null;
  const navigation = useNavigation();
  const { data, loading: gendersLoading } = useQuery(GENDER_OPTIONS, {
    fetchPolicy: 'cache-first',
  });
  const {
    gender: userGender,
    birthDate: userBirthDate,
    loading: userLoading,
  } = useCurrentUser({
    onUpdate: () => navigation.goBack(null),
  });
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState(null);

  const loading = gendersLoading || userLoading;
  const genders = data?.genderOptions || [];
  const onPress = () => {
    if (!loading) {
    }
  };

  useEffect(
    () => {
      if (userGender && !loading) {
        setGender(userGender);
      }
    },
    [userGender]
  );

  useEffect(
    () => {
      if (userBirthDate && !loading) {
        setBirthDate(moment(userBirthDate));
      }
    },
    [userBirthDate]
  );

  console.log({ gender, birthDate });

  return (
    <ProfileEntryFieldContainer>
      <H3>Update Personal Details</H3>
      <FieldLabel padded>Gender</FieldLabel>
      <RadioInput
        label="Gender"
        type="radio"
        value={gender}
        onChange={(value) => setGender(value)}
      >
        {genders.map((g) => [
          <RadioButton
            key={g}
            value={g}
            label={() => <RadioLabel>{g}</RadioLabel>}
            underline={false}
          />,
        ])}
      </RadioInput>
      <FieldLabel>Birthday</FieldLabel>
      {!!birthDate && (
        <DateInput
          label=""
          value={moment(birthDate).toDate()}
          placeholder={
            // only show a birthday if we have one.
            moment(birthDate).isValid() // DatePicker shows displayValue > placeholder > label in that order
              ? moment(birthDate).format('MMM D, YYYY')
              : 'Select a date...' // Pass an empty string if we don't have a birthday to show the placeholder.
          }
          onConfirm={(value) => {
            setBirthDate(value);
          }}
          maxYear={moment().year() - 13}
        />
      )}

      <Disclaimer>
        *You must be at least 13 years old to have an account.
      </Disclaimer>

      <VerticalPadding>
        <Button
          title="Done"
          onPress={onPress}
          disabled={loading}
          loading={loading}
        />
      </VerticalPadding>
    </ProfileEntryFieldContainer>
  );
};

EditProfileDetails.propTypes = {};
EditProfileDetails.defaultProps = {};

export default EditProfileDetails;
