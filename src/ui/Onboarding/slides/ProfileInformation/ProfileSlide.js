import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { get } from 'lodash';
import { Button, PaddedView, TextInput, BackgroundView } from '@apollosproject/ui-kit';

import ProfileForm from './Form'

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
    ...props
}) => (
        <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior={'padding'}>
            <BackgroundComponent>
                <FlexedSafeAreaView>
                    <ScrollView>
                        <ProfileForm {...props} />
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
    confirmationTitleText: 'Hey Anakin Skywalker!',
    confirmationPromptText:
        'Enter in your password below to get signed in',
    BackgroundComponent: BackgroundView,
};

export default Verification;
