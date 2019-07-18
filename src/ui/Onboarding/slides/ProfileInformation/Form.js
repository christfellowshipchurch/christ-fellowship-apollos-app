import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import moment from 'moment';

import { PaddedView, TextInput, RadioButton } from '@apollosproject/ui-kit';

import {
    StyledRadio,
    RadioLabel,
    Label,
    StyledDate
} from '../styles'

// memo = sfc PureComponent 💥
const AskName = memo(
    ({
        onPressPrimary,
        firstName,
        lastName,
        values,
        touched,
        errors,
        setFieldValue,
        isLoading,
        genderList,
        defaultDate,
        ...props
    }) => {
        let LastNameInput = null;

        return (
            <PaddedView>
                <TextInput
                    label={'First Name'}
                    type={'text'}
                    textContentType={'givenName'} // ios autofill
                    returnKeyType={'next'}
                    value={get(values, 'firstName')}
                    error={
                        get(touched, 'firstName', false) &&
                        get(errors, 'firstName', null)
                    }
                    onChangeText={(text) => setFieldValue('firstName', text)}
                    onSubmitEditing={() => LastNameInput.focus()}
                    disabled={isLoading}
                    enablesReturnKeyAutomatically
                />
                <TextInput
                    label={'Last Name'}
                    type={'text'}
                    textContentType={'familyName'} // ios autofill
                    returnKeyType={'next'}
                    value={get(values, 'lastName')}
                    error={
                        get(touched, 'lastName', false) &&
                        get(errors, 'lastName', null)
                    }
                    onChangeText={(text) => setFieldValue('lastName', text)}
                    onSubmitEditing={onPressPrimary}
                    disabled={isLoading}
                    enablesReturnKeyAutomatically
                    inputRef={(r) => {
                        LastNameInput = r;
                    }}
                />

                <Label padded>Gender</Label>
                <StyledRadio
                    label="Gender"
                    type="radio"
                    value={get(values, 'gender')}
                    error={get(touched, 'gender') && get(errors, 'gender')}
                    onChange={(value) => setFieldValue('gender', value)}
                >
                    {genderList.map((gender) => [
                        <RadioButton
                            key={gender}
                            value={gender}
                            label={() => <RadioLabel>{gender}</RadioLabel>}
                            underline={false}
                        />,
                    ])}
                </StyledRadio>

                <Label>Birthday</Label>
                <StyledDate
                    type={'DateInput'}
                    placeholder={'Select date of birth...'}
                    value={moment
                        .utc(get(values, 'birthDate', defaultDate) || defaultDate)
                        .toDate()}
                    error={get(touched, 'birthDate') && get(errors, 'birthDate')}
                    displayValue={
                        // only show a birthday if we have one.
                        get(values, 'birthDate', '') // DatePicker shows displayValue > placeholder > label in that order
                            ? moment(values.birthDate).format('MM/DD/YYYY')
                            : '' // Pass an empty string if we don't have a birthday to show the placeholder.
                    }
                    onChange={(value) => setFieldValue('birthDate', value)}
                />
            </PaddedView>
        );
    }
);

AskName.propTypes = {
    /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
     * children. Thus we have to use more unique name.
     */
    setFieldValue: PropTypes.func.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    touched: PropTypes.shape({}),
    errors: PropTypes.shape({}),
    values: PropTypes.shape({}),
    onPressPrimary: PropTypes.func,
    isLoading: PropTypes.bool,
    genderList: PropTypes.arrayOf(PropTypes.string),
    defaultDate: PropTypes.instanceOf(Date),
};

AskName.defaultProps = {
    genderList: ['Male', 'Female'],
    defaultDate: new Date(),
};

AskName.displayName = 'AskName';

export default AskName;
