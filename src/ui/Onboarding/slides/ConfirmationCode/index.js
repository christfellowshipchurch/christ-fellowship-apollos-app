import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { get } from 'lodash';
import { Button, PaddedView, TextInput, BackgroundView } from '@apollosproject/ui-kit';

import {
    FlexedSafeAreaView,
    NextButton,
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
                                label={'Verification Code'}
                                type={'numeric'}
                                autoComplete={'password'}
                                enablesReturnKeyAutomatically
                                returnKeyType={'next'}
                                onSubmitEditing={onPressNext}
                                error={get(errors, 'code')}
                                onChangeText={(text) => setFieldValue('code', text)}
                                value={get(values, 'code')}
                            />
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
};

Verification.defaultProps = {
    confirmationTitleText: 'Thanks!\nStand by…',
    confirmationPromptText:
        'We just sent you a code. Enter it below when it comes.',
    BackgroundComponent: BackgroundView,
};

export default Verification;
