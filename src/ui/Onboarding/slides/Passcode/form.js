import React from 'react'
import { has, get } from 'lodash'
import {
    styled,
    H6,
    TextInput,
} from '@apollosproject/ui-kit'

import {
    FormFields,
    SubmitButton
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
    titleText,
    inputLabel,
    type,
    promptText,
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
        <React.Fragment>
            <FormFields>
                <BrandIcon />
                <TitleText>{titleText[type]}</TitleText>
                <PromptText padded>
                    {promptText[type]}
                </PromptText>

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

PasscodeForm.defaultProps = {
    titleText: {
        sms: 'Confirmation Code',
        password: 'Password'
    },
    promptText:
    {
        sms: "Enter in the Confirmation Code that was texted to your mobile phone number.",
        password: "Enter in your existing password or create your password below."
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
