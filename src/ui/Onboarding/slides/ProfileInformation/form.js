import React from 'react';
import { has, get } from 'lodash'
import moment from 'moment'
import {
    H6,
    TextInput,
    RadioButton
} from '@apollosproject/ui-kit'

import {
    TitleText,
    PromptText,
    BrandIcon,
} from '../styles.js'

import {
    FormFields,
    SubmitButton
} from '../containers.js'

import {
    StyledRadio,
    RadioLabel,
    Label,
    StyledDate,
} from '../styles'

const ProfileInformationForm =
    ({
        values,
        errors,
        setFieldValue,
        isLoading,
        genderList,
        defaultDate,
        buttonText,
        handleSubmit,
        isSubmitting,
        titleText,
        promptText,
    }) => {
        const disabled = (isSubmitting
            || (has(errors, 'username') || get(values, 'username', '') === '')
            || (has(errors, 'lastName') || get(values, 'lastName', '') === '')
            || (has(errors, 'birthDate') || get(values, 'birthDate', '') === ''))

        let LastNameInput = null

        return (
            <React.Fragment>
                <FormFields>
                    <BrandIcon />
                    <TitleText>{titleText}</TitleText>
                    <PromptText padded>
                        {promptText}
                    </PromptText>
                    {get(errors, 'general', null)
                        ? (
                            <H6 padded>
                                {get(errors, 'general')}
                            </H6>
                        ) : null}

                    <TextInput
                        label={'First Name*'}
                        type={'text'}
                        textContentType='givenName'
                        returnKeyType={'next'}
                        value={get(values, 'firstName')}
                        error={get(errors, 'firstName', null)}
                        onChangeText={(text) => setFieldValue('firstName', text)}
                        onSubmitEditing={() => LastNameInput.focus()}
                        disabled={isLoading}
                        enablesReturnKeyAutomatically
                    />

                    <TextInput
                        label={'Last Name*'}
                        type={'text'}
                        textContentType='familyName'
                        returnKeyType={'next'}
                        value={get(values, 'lastName')}
                        error={get(errors, 'lastName', null)}
                        onChangeText={(text) => setFieldValue('lastName', text)}
                        disabled={isLoading}
                        enablesReturnKeyAutomatically
                        inputRef={(r) => {
                            LastNameInput = r;
                        }}
                    />

                    <Label padded>Birthday*</Label>
                    <StyledDate
                        type={'DateInput'}
                        placeholder={'Select date of birth...'}
                        value={moment
                            .utc(get(values, 'birthDate', defaultDate) || defaultDate)
                            .toDate()}
                        error={get(errors, 'birthDate', null)}
                        displayValue={
                            // only show a birthday if we have one.
                            get(values, 'birthDate', '') // DatePicker shows displayValue > placeholder > label in that order
                                ? moment(values.birthDate).format('MM/DD/YYYY')
                                : '' // Pass an empty string if we don't have a birthday to show the placeholder.
                        }
                        onChange={(value) => setFieldValue('birthDate', value)}
                    />

                    <Label padded>Gender</Label>
                    <StyledRadio
                        label="Gender"
                        type="radio"
                        value={get(values, 'gender')}
                        error={get(errors, 'gender', null)}
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
                </FormFields>
                <SubmitButton
                    buttonProps={{
                        title: buttonText,
                        onPress: handleSubmit,
                        disabled,
                        loading: isSubmitting
                    }}
                />
            </React.Fragment>
        )
    }

ProfileInformationForm.defaultProps = {
    genderList: ['Male', 'Female'],
    defaultDate: new Date(),
    buttonText: 'Next',
    titleText: "Let's get to know each other better",
    promptText: "In order for us to get you the blah blah blah. So let's go ahead and bleedidy doopody dee",
    requiredFieldText: "*indicates a required field"
}

export default ProfileInformationForm
