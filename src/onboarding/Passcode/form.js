import React from 'react'
import { has, get } from 'lodash'
import {
    styled,
    H6,
    TextInput,
    Button
} from '@apollosproject/ui-kit'

import {
    Container
} from '../containers.js'

import {
    TitleText,
    PromptText,
    BrandIcon,
} from '../styles.js'

const LegalText = styled(
    ({ theme }) => ({
        color: theme.colors.text.tertiary,
    }),
    'ui-auth.SMSLandingPage.LegalText'
)(H6)

const PasscodeForm = ({
    errors,
    setFieldValue,
    title,
    inputLabel,
    type,
    description,
    buttonText,
    handleSubmit,
    values,
    touched,
    isSubmitting
}) => {
    const disabled = has(errors, 'password') || get(values, 'password', '') === '' || isSubmitting
    const inputType = type === 'sms' ? 'numeric' : 'password'
    const textContentType = type === 'sms' ? 'oneTimeCode' : 'password'

    return (
        <Container title={title[type]} description={description[type]}>
            <TextInput
                autoCompleteType={'password'}
                textContentType={textContentType}
                label={inputLabel[type]}
                type={inputType}
                value={values.password}
                returnKeyType={'done'}
                error={touched.password && errors.password}
                onChangeText={(text) => setFieldValue('password', text)}
                autoCapitalize='none'
                autoFocus
                enablesReturnKeyAutomatically
            />
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

PasscodeForm.defaultProps = {
    title: {
        sms: 'Enter Confirmation Code',
        password: 'Enter Password'
    },
    description:
    {
        sms: "Please enter the Confirmation Code that was texted to your mobile device.",
        password: [
            "Enter in your existing password or create your password below.",
            'Your password must be 6-20 characters in length'
        ]
    },
    buttonText: 'Submit',
    inputLabel: {
        sms: "Confirmation Code",
        password: "Password"
    },
    type: 'sms' // sms or password
}

PasscodeForm.LegalText = LegalText

export default PasscodeForm
