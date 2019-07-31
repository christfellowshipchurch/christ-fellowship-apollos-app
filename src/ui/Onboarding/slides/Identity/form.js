import React from 'react'
import { has, get } from 'lodash'
import {
    styled,
    H6,
    TextInput,
    ButtonLink,
    PaddedView
} from '@apollosproject/ui-kit'

import {
    FormFields,
    SubmitButton
} from '../containers.js'

import {
    TitleText,
    PromptText,
    BrandIcon,
    FlexedFooter
} from '../styles.js'

const LegalText = styled(
    ({ theme }) => ({
        color: theme.colors.text.tertiary,
        marginTop: theme.sizing.baseUnit
    }),
    'ui-auth.SMSLandingPage.LegalText'
)(H6)

const UsernameForm = ({
    errors,
    setFieldValue,
    loginPolicyInfo,
    loginPromptText,
    loginButtonText,
    loginDislaimerText,
    handleSubmit,
    values,
    touched,
    isSubmitting,
    navigation,
    navigateToPrivacyPolicy
}) => {
    const disabled = has(errors, 'username') || get(values, 'username', '') === '' || isSubmitting

    return (
        <React.Fragment>
            <FormFields>
                <BrandIcon />
                <TitleText>Welcome Home!</TitleText>
                <PromptText padded>We're more than a blah blah blah. We're a bleebidy bloobidy do</PromptText>
                <PromptText padded>
                    {loginPromptText}
                </PromptText>

                <TextInput
                    textContentType='telephoneNumber'
                    label={'Mobile Number or Email'}
                    type="text"
                    value={values.username}
                    returnKeyType={'done'}
                    error={touched.username && errors.username}
                    onChangeText={(text) => setFieldValue('username', text)}
                    autoCapitalize='none'
                    enablesReturnKeyAutomatically
                />
                <LegalText>{loginPolicyInfo}</LegalText>
                <LegalText>
                    {loginDislaimerText} <ButtonLink onPress={() => navigateToPrivacyPolicy(navigation)}>Privacy Policy</ButtonLink>
                </LegalText>
            </FormFields>

            <SubmitButton
                buttonProps={{
                    title: loginButtonText,
                    onPress: handleSubmit,
                    disabled,
                    loading: isSubmitting,
                }}
            />
        </React.Fragment>
    )
}

UsernameForm.defaultProps = {
    titleText: 'Welcome Home!',
    loginPolicyInfo:
        "We'll never share your information or contact you (unless you ask!).",
    loginPromptText:
        "Get started by entering in either you phone number or email address.",
    loginButtonText: 'Agree and Continue',
    loginDislaimerText: 'I understand and agree to the following policies as laid out by Christ Fellowship Church:'
}

UsernameForm.LegalText = LegalText

export default UsernameForm
