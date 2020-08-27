import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import moment from 'moment';
import {
  RadioButton,
  ThemeMixin,
  styled,
  UIText,
} from '@apollosproject/ui-kit';

import {
  ProfileEntryFieldContainer,
  LegalText,
  FieldLabel,
  RadioInput,
  RadioLabel,
} from '@apollosproject/ui-auth/src/styles';

import { DateInput } from '../ui/inputs';

const Disclaimer = styled(({ theme }) => ({
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontSize: 12,
  color: theme.colors.text.tertiary,
}))(UIText);

const ProfileDetailsEntry = (props) => (
  <ThemeMixin mixin={{ type: 'dark' }}>
    <ProfileEntryFieldContainer {...props}>
      <FieldLabel padded>Gender</FieldLabel>
      <RadioInput
        label="Gender"
        type="radio"
        value={get(props.values, 'gender')}
        error={get(props.touched, 'gender') && get(props.errors, 'gender')}
        onChange={(value) => props.setFieldValue('gender', value)}
      >
        {props.genderList.map((gender) => [
          <RadioButton
            key={gender}
            value={gender}
            label={() => <RadioLabel>{gender}</RadioLabel>}
            underline={false}
          />,
        ])}
      </RadioInput>
      <FieldLabel>Birthday</FieldLabel>
      <DateInput
        label=""
        value={moment(
          get(props.values, 'birthDate', props.defaultDate) || props.defaultDate
        ).toDate()}
        error={get(props.errors, 'birthDate')}
        placeholder={
          // only show a birthday if we have one.
          moment(get(props.values, 'birthDate', '')).isValid() // DatePicker shows displayValue > placeholder > label in that order
            ? moment(props.values.birthDate).format('MMM D, YYYY')
            : 'Select a date...' // Pass an empty string if we don't have a birthday to show the placeholder.
        }
        onConfirm={(value) => {
          if (moment(value).isAfter(moment().subtract(13, 'years'))) {
            props.setFieldError(
              'birthDate',
              'You must be at least 13 to create an account'
            );
          } else {
            props.setFieldValue('birthDate', value);
          }
        }}
        maxYear={moment().year() - 13}
      />
      <Disclaimer>
        *You must be at least 13 years old to have an account.
      </Disclaimer>
    </ProfileEntryFieldContainer>
  </ThemeMixin>
);

ProfileDetailsEntry.propTypes = {
  title: PropTypes.node,
  prompt: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.shape({
    phone: PropTypes.string,
    birthDate: PropTypes.string,
  }),
  touched: PropTypes.shape({
    gender: PropTypes.bool,
    birthDate: PropTypes.bool,
  }),
  isLoading: PropTypes.bool,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  setFieldValue: PropTypes.func.isRequired,
  setFieldError: PropTypes.func.isRequired,
  values: PropTypes.shape({
    phone: PropTypes.string,
    birthDate: PropTypes.instanceOf(Date),
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onPressBack: PropTypes.func.isRequired,
  genderList: PropTypes.arrayOf(PropTypes.string),
  defaultDate: PropTypes.instanceOf(Date),
  minAge: PropTypes.number,
};

ProfileDetailsEntry.defaultProps = {
  title: "This one's easy.",
  prompt:
    'Help us learn a little more about you so we can connect you with the best ministries and events.',
  genderList: ['Male', 'Female', 'Prefer not to reply'],
  defaultDate: moment().subtract(13, 'years'),
  minAge: 13,
};

ProfileDetailsEntry.LegalText = LegalText;

ProfileDetailsEntry.displayName = 'ProfileDetailsEntry';

export default ProfileDetailsEntry;
