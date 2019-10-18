import React from 'react';
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo'
import { has, get } from 'lodash'
import moment from 'moment'

import { useForm } from 'ChristFellowship/src/hooks'

import { UPDATE_PROFILE, HANDLE_LOGIN } from '../mutations'

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

const validation = {
    firstName: (value) => value && value !== ''
        ? false
        : 'Please enter your first name',
    lastName: (value) => value && value !== ''
        ? false
        : 'Please enter your last name',
    birthDate: (value) => value && moment().diff(moment(value), 'years') >= 13
        ? false
        : 'You must be at least 13 years old to create an account'
}

const ProfileInformationForm = ({
    genderList,
    defaultDate,
    buttonText,
    titleText,
    propmtText,
    navigation,
}) => {
    const {
        values,
        errors,
        submitting,
        setValue,
        setSubmitting,
        setError,
        resetForm,
    } = useForm({
        validation,
        defaultValues: {
            birthDate: defaultDate
        }
    })
    const [updateProfile] = useMutation(UPDATE_PROFILE)
    const [handleLogin] = useMutation(HANDLE_LOGIN)

    const handleSubmit = () => {
        setSubmitting(true)

        const { identity, passcode } = get(navigation, 'state.params')

        if (identity && passcode) {
            updateProfile({
                variables: {
                    identity,
                    passcode,
                    firstName: get(values, 'firstName'),
                    lastName: get(values, 'lastName'),
                    birthDate: get(values, 'birthDate'),
                    gender: get(values, 'gender', 'Unknown')
                },
                update: (cache, { data: { relateUserLoginToPerson: { token } } }) => {
                    handleLogin({
                        variables: {
                            authToken: token
                        },
                        update: () => {
                            navigation.navigate('EnableNotifications')
                        }
                    })
                    resetForm()
                },
                onError: () => {
                    setError('general', 'There was an issue with your submission. Please refresh the page and try again.')
                    resetForm()
                }
            })
        } else {
            setError('general', 'There was an issue with your submission. Please refresh the page and try again.')
            resetForm()
        }
    }

    const disabled = submitting
        || !!get(errors, 'firstName', true)
        || !!get(errors, 'lastName', true)
        || !!get(errors, 'birthDate', true)

    let LastNameInput = null

    return (
        <Container title={titleText} description={propmtText}>
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
                onChangeText={(text) => setValue('firstName', text)}
                onSubmitEditing={() => LastNameInput.focus()}
                disabled={submitting}
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
                onChangeText={(text) => setValue('lastName', text)}
                disabled={submitting}
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
                onConfirm={(value) => setValue('birthDate', value)}
                icon='birthday-cake'
                label="Birthday*"
                disabled={disabled}
            />

            <Radio
                label="Gender"
                type="radio"
                value={get(values, 'gender')}
                error={get(errors, 'gender', null)}
                onChange={(value) => setValue('gender', value)}
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
                    loading={submitting}
                />
            </Container.Footer>
        </Container>
    )
}

ProfileInformationForm.defaultProps = {
    genderList: ['Male', 'Female'],
    defaultDate: new Date(),
    buttonText: 'Next',
    titleText: "Help us help you...",
    propmtText: "By getting to know you better we can make your app experience unique to you. Please take a moment to complete your profile information.",
    requiredFieldText: "*indicates a required field"
}

ProfileInformationForm.propTypes = {
    genderList: PropTypes.arrayOf(PropTypes.string),
    defaultDate: PropTypes.string,
    titleText: PropTypes.string,
    propmtText: PropTypes.string,
    buttonText: PropTypes.string,
    update: PropTypes.func,
}

export default ProfileInformationForm
