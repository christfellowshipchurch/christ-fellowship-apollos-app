import React from 'react'
import { has, get, upperCase } from 'lodash'
import {
    Button
} from '@apollosproject/ui-kit'

import { TextInput } from 'ChristFellowship/src/ui/inputs'

import {
    Container,
} from '../containers.js'

const UsernameForm = ({
    errors,
    setFieldValue,
    handleSubmit,
    values,
    touched,
    isSubmitting,
    loginButtonText,
    navigation,
    navigateToPrivacyPolicy,
    title,
    description,
    buttonText
}) => {
    const disabled = has(errors, 'username') || get(values, 'username', '') === '' || isSubmitting

    console.log({ errors })

    return (
        <Container title={title} description={description}>
            <TextInput
                textContentType='telephoneNumber'
                label={'Mobile Number OR Email'}
                type="text"
                value={values.username}
                returnKeyType={'done'}
                error={errors.username}
                onChangeText={(text) => setFieldValue('username', text)}
                autoCapitalize='none'
                enablesReturnKeyAutomatically
                errorIndicator={has(values, 'username') && values.username !== ''}
                hideErrorText
                icon='user'
            />

            <Container.Footer>
                <Button
                    title={upperCase(buttonText)}
                    onPress={handleSubmit}
                    disabled={disabled}
                    loading={isSubmitting}
                />
            </Container.Footer>
        </Container>
    )
}

UsernameForm.defaultProps = {
    title: 'Welcome Home!',
    description: [
        'Your new Christ Fellowship digital experience starts here, and your profile helps us customize it for you.',
        'Please enter either your phone or email address to get started.'
    ],
    buttonText: 'Agree and Continue'
}

export default UsernameForm
