import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { get } from 'lodash';
import {
    styled,
    H6,
    PaddedView,
    TextInput,
    BackgroundView,
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

const LandingPage = ({
    disabled,
    errors,
    isLoading,
    onPressNext,
    setFieldValue,
    loginPolicyInfo,
    loginPromptText,
    BackgroundComponent,
}) => (
        <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior={'padding'}>
            <BackgroundComponent>
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
                                autoFocus
                                autoComplete={'tel'}
                                label={'Mobile Number or Email'}
                                type={'phone'}
                                enablesReturnKeyAutomatically
                                returnKeyType={'next'}
                                onSubmitEditing={onPressNext}
                                error={get(errors, 'phone')}
                                onChangeText={(text) => setFieldValue('phone', text)}
                            />
                            <LegalText>{loginPolicyInfo}</LegalText>
                        </PaddedView>
                    </ScrollView>

                    {onPressNext ? (
                        <PaddedView>
                            <Button
                                title={'Next'}
                                onPress={onPressNext}
                                disabled={disabled}
                                loading={isLoading}
                            />
                        </PaddedView>
                    ) : null}
                </FlexedSafeAreaView>
            </BackgroundComponent>
        </KeyboardAvoidingView>
    );

LandingPage.propTypes = {
    authTitleText: PropTypes.string,
    disabled: PropTypes.bool,
    errors: PropTypes.shape({
        phone: PropTypes.string,
    }),
    isLoading: PropTypes.bool,
    onPressNext: PropTypes.func, // used to navigate and/or submit the form
    setFieldValue: PropTypes.func.isRequired,
    loginPolicyInfo: PropTypes.string,
    loginPromptText: PropTypes.string,
    BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

LandingPage.defaultProps = {
    titleText: 'Welcome Home!',
    loginPolicyInfo:
        "We'll never share your information or contact you (unless you ask!).",
    loginPromptText:
        "Get started by entering in either you phone number or email address.",
    BackgroundComponent: BackgroundView,
};

LandingPage.LegalText = LegalText;

LandingPage.displayName = 'LandingPage';

export default LandingPage;
