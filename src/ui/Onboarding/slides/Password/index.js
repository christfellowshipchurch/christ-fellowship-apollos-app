import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { get } from 'lodash';
import { Button, PaddedView, TextInput, BackgroundView } from '@apollosproject/ui-kit';
import { ProfileForm } from '../ProfileInformation'

import {
    FlexedSafeAreaView,
    TitleText,
    PromptText,
    BrandIcon,
} from '../styles';

const Verification = ({
    confirmationTitleText,
    confirmationPromptText,
    disabled,
    errors,
    isLoading,
    onPressNext,
    setFieldValue,
    values,
    BackgroundComponent,
    newUser
}) => (
        <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior={'padding'}>
            <BackgroundComponent>
                <FlexedSafeAreaView>
                    <ScrollView>
                        <PaddedView>
                            <BrandIcon />
                            <TitleText>{confirmationTitleText}</TitleText>
                            <PromptText padded>{confirmationPromptText}</PromptText>

                            <TextInput
                                autoFocus
                                label={'Password'}
                                type={'password'}
                                autoComplete={'password'}
                                enablesReturnKeyAutomatically
                                returnKeyType={'next'}
                                onSubmitEditing={onPressNext}
                                error={get(errors, 'code')}
                                onChangeText={(text) => setFieldValue('code', text)}
                                value={get(values, 'code')}
                            />
                        </PaddedView>

                        {newUser ? (
                            <>
                                <PromptText padded>{confirmationPromptText}</PromptText>
                                <ProfileForm />
                            </>
                        ) : null}

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

Verification.propTypes = {
    confirmationTitleText: PropTypes.string,
    confirmationPromptText: PropTypes.string,
    disabled: PropTypes.bool,
    errors: PropTypes.shape({
        code: PropTypes.string,
    }),
    isLoading: PropTypes.bool,
    onPressNext: PropTypes.func,
    setFieldValue: PropTypes.func.isRequired,
    values: PropTypes.shape({
        code: PropTypes.string,
    }),
    BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    newUser: PropTypes.bool,
};

Verification.defaultProps = {
    confirmationTitleText: 'Hey Anakin Skywalker!',
    confirmationPromptText:
        'Enter in your password below to get signed in',
    BackgroundComponent: BackgroundView,
    newUser: true,
};

export default Verification;
