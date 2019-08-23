import React from 'react';
import { has, get } from 'lodash'
import moment from 'moment'
import {
    H6,
    Button
} from '@apollosproject/ui-kit'

import {
    TextInput,
    Radio,
    RadioButton,
    DateInput
} from 'ChristFellowship/src/ui/inputs'

import {
    Container
} from '../containers.js'

import {
    Label,
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
        title,
        description,
    }) => {
        const disabled = (isSubmitting
            || (has(errors, 'username') || get(values, 'username', '') === '')
            || (has(errors, 'lastName') || get(values, 'lastName', '') === '')
            || (has(errors, 'birthDate') || get(values, 'birthDate', '') === ''))

        let LastNameInput = null

        return (
            <Container title={title} description={description}>
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
                    icon='user'
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
                    icon='user'
                    inputRef={(r) => {
                        LastNameInput = r;
                    }}
                />

                <DateInput
                    value={has(values, 'birthDate')
                        ? moment
                            .utc(get(values, 'birthDate', defaultDate) || defaultDate)
                            .toString()
                        : ''}
                    error={get(errors, 'birthDate', null)}
                    displayValue={
                        // only show a birthday if we have one.
                        get(values, 'birthDate', '') // DatePicker shows displayValue > placeholder > label in that order
                            ? moment(values.birthDate).format('MM/DD/YYYY')
                            : '' // Pass an empty string if we don't have a birthday to show the placeholder.
                    }
                    onConfirm={(value) => setFieldValue('birthDate', value)}
                    icon='birthday-cake'
                    label="Birthday*"
                />

                <Radio
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
                            label={gender}
                            underline={false}
                        />,
                    ])}
                </Radio>

                <Container.Footer>
                    <Button
                        title={buttonText}
                        onPress={handleSubmit}
                        disabled={disabled}
                        loading={isSubmitting}
                    />
                </Container.Footer>
            </Container>
        )
    }

ProfileInformationForm.defaultProps = {
    genderList: ['Male', 'Female'],
    defaultDate: new Date(),
    buttonText: 'Next',
    title: "Help us help you...",
    description: "By getting to know you better we can make your app experience unique to you. Please take a moment to complete your profile information.",
    requiredFieldText: "*indicates a required field"
}

export default ProfileInformationForm
