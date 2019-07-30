import React from 'react';
import PropTypes from 'prop-types';
import { has, get } from 'lodash'
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import {
    styled,
    H6,
    PaddedView,
    TextInput,
    Button
} from '@apollosproject/ui-kit';

import {
    FlexedSafeAreaView,
    TitleText,
    PromptText,
    BrandIcon,
} from '../styles.js';

const LegalText = styled(
    ({ theme }) => ({
        color: theme.colors.text.tertiary,
    }),
    'ui-auth.SMSLandingPage.LegalText'
)(H6);

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
    const inputType = type === 'password' ? 'password' : 'numeric'

    return (
        <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior={'padding'}>
            <FlexedSafeAreaView>
                <ScrollView>
                    <PaddedView>
                        <BrandIcon />
                        <TitleText>{titleText[type]}</TitleText>
                        <PromptText padded>
                            {promptText[type]}
                        </PromptText>

                        <TextInput
                            textContentType='password'
                            autoComplete={'password'}
                            label={inputLabel[type]}
                            type={inputType}
                            value={values.password}
                            returnKeyType={'next'}
                            error={touched.password && errors.password}
                            onChangeText={(text) => setFieldValue('password', text)}
                            autoCapitalize='none'
                            autoFocus
                            enablesReturnKeyAutomatically
                        />
                    </PaddedView>
                </ScrollView>

                <PaddedView>
                    <Button
                        title={buttonText}
                        onPress={handleSubmit}
                        disabled={disabled}
                        loading={isSubmitting}
                    />
                </PaddedView>
            </FlexedSafeAreaView>
        </KeyboardAvoidingView>
    )
};

PasscodeForm.propTypes = {};

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
        code: "Confirmation Code",
        password: "Password"
    },
    type: 'sms' // code or password
};

PasscodeForm.LegalText = LegalText;

PasscodeForm.displayName = 'LandingPage';

export default PasscodeForm;
