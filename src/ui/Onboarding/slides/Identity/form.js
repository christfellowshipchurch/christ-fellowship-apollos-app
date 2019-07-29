import React from 'react';
import PropTypes from 'prop-types';
import { has, get } from 'lodash'
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import {
    styled,
    H6,
    PaddedView,
    TextInput,
    Button,
    ButtonLink
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
    const disabled = has(errors, 'username') || get(values, 'username', '') === ''

    return (
        <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior={'padding'}>
            <FlexedSafeAreaView>
                <ScrollView>
                    <PaddedView>
                        <BrandIcon />
                        <TitleText>Welcome Home!</TitleText>
                        <PromptText padded>We're more than a blah blah blah. We're a bleebidy bloobidy do</PromptText>
                        <PromptText padded>
                            {loginPromptText}
                        </PromptText>

                        <TextInput
                            textContentType='username'
                            label={'Mobile Number or Email'}
                            type="text"
                            value={values.username}
                            returnKeyType={'next'}
                            error={touched.username && errors.username}
                            onChangeText={(text) => setFieldValue('username', text)}
                            // onSubmitEditing={onSubmit}
                            autoCapitalize='none'
                            autoFocus
                            enablesReturnKeyAutomatically
                        />


                        <LegalText>{loginPolicyInfo}</LegalText>
                    </PaddedView>
                </ScrollView>

                <PaddedView>
                    <PaddedView>
                        <LegalText padded>
                            {loginDislaimerText} <ButtonLink onPress={() => navigateToPrivacyPolicy(navigation)}>Privacy Policy</ButtonLink>
                        </LegalText>
                    </PaddedView>
                    <Button
                        title={loginButtonText}
                        onPress={handleSubmit}
                        disabled={disabled}
                        loading={isSubmitting}
                    />
                </PaddedView>
            </FlexedSafeAreaView>
        </KeyboardAvoidingView>
    )
};

UsernameForm.propTypes = {
    authTitleText: PropTypes.string,
    disabled: PropTypes.bool,
    errors: PropTypes.shape({
        phone: PropTypes.string,
    }),
    isLoading: PropTypes.bool,
    setFieldValue: PropTypes.func.isRequired,
    loginPolicyInfo: PropTypes.string,
    loginPromptText: PropTypes.string,
    loginButtonText: PropTypes.string,
    loginDislaimerText: PropTypes.string,
};

UsernameForm.defaultProps = {
    titleText: 'Welcome Home!',
    loginPolicyInfo:
        "We'll never share your information or contact you (unless you ask!).",
    loginPromptText:
        "Get started by entering in either you phone number or email address.",
    loginButtonText: 'Agree and Continue',
    loginDislaimerText: 'I understand and agree to the following policies as laid out by Christ Fellowship Church:'
};

UsernameForm.LegalText = LegalText;

UsernameForm.displayName = 'LandingPage';

export default UsernameForm;
