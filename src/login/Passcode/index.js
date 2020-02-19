import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { has, get } from 'lodash';

import { styled, H6, Button } from '@apollosproject/ui-kit';
import { TextInput } from '../../ui/inputs';
import { useForm } from '../../hooks';

import {
    AUTHENTICATE_CREDENTIALS,
    CREATE_NEW_LOGIN,
    HANDLE_LOGIN,
} from '../mutations';

import { Container } from '../containers';
import ResendSMS from '../ResendSMS';
import PasswordReset from '../PasswordReset';

const LegalText = styled(
    ({ theme }) => ({
        color: theme.colors.text.tertiary,
    }),
    'ui-auth.SMSLandingPage.LegalText'
)(H6);

const LinkText = styled(({ theme }) => ({
    color: theme.colors.primary,
}))(H6);

const PasscodeForm = ({
    title,
    inputLabel,
    description,
    buttonText,
    navigation,
}) => {
    const {
        values,
        errors,
        submitting,
        setValue,
        setSubmitting,
        setError,
        resetForm,
    } = useForm();
    const [authenticateCredentials] = useMutation(AUTHENTICATE_CREDENTIALS);
    const [createNewLogin] = useMutation(CREATE_NEW_LOGIN);
    const [handleLogin] = useMutation(HANDLE_LOGIN);

    const { type, identity, isExistingIdentity } = get(
        navigation,
        'state.params'
    );

    const handleSubmit = async () => {
        setSubmitting(true);
        const { passcode } = values;

        // isExisitingIdentity checks for an existing Sms login
        // password logins aren't known to be existing or not until the authentication is run
        if (isExistingIdentity) {
            try {
                await authenticateCredentials({
                    variables: { identity, passcode },
                    update: (
                        cache,
                        {
                            data: {
                                authenticateCredentials: { token },
                            },
                        }
                    ) => {
                        if (token) {
                            handleLogin({
                                variables: { authToken: token },
                                update: () => {
                                    navigation.navigate('Tabs');
                                    resetForm();
                                },
                            });
                        } else {
                            resetForm();
                        }
                    },
                    onError: () => {
                        console.log('onError');

                        // the code or password entered was for an existing user login and was incorrect
                        setError(
                            'passcode',
                            `The ${inputLabel[type]} you entered is incorrect`
                        );

                        resetForm();
                    },
                    onComplete: () => {
                        console.log('onComplete');
                    },
                });
            } catch (e) {
                console.log('catch', { e });
                resetForm();
                setError(
                    'passcode',
                    `The ${inputLabel[type]} you entered is incorrect`
                );
            }
        } else {
            createNewLogin({
                variables: { identity, passcode },
                update: () => {
                    navigation.navigate('ProfileInformation', {
                        identity,
                        passcode,
                        isExistingIdentity,
                    });
                    resetForm();
                },
                onError: () => {
                    setError(
                        'passcode',
                        'Sorry! We are unable to log you in at this time'
                    );
                    resetForm();
                },
            });
        }
    };

    const inputType = type === 'sms' ? 'numeric' : 'password';
    const textContentType = type === 'sms' ? 'oneTimeCode' : 'password';
    const disabled =
        submitting ||
        !!get(errors, 'passcode', false) ||
        get(values, 'passcode', '') === '';

    return (
        <Container title={title[type]} description={description[type]}>
            <TextInput
                autoCompleteType={'password'}
                textContentType={textContentType}
                label={inputLabel[type]}
                type={inputType}
                value={get(values, 'passcode', '')}
                returnKeyType={'done'}
                error={get(errors, 'passcode', '')}
                onChangeText={(text) => setValue('passcode', text)}
                autoCapitalize="none"
                autoFocus
                enablesReturnKeyAutomatically
                errorIndicator={has(errors, 'passcode')}
                icon="lock"
            />
            {type === 'sms' &&
                identity &&
                identity !== '' && (
                    <ResendSMS phoneNumber={identity}>
                        <H6>Didn't get a code?</H6> <LinkText>Request a new one.</LinkText>
                    </ResendSMS>
                )}
            {type === 'password' &&
                identity &&
                identity !== '' &&
                isExistingIdentity && (
                    <PasswordReset
                        email={identity}
                        update={() => {
                            navigation.navigate('Identity');
                            resetForm();
                        }}
                        onPress={() => setSubmitting(true)}
                    >
                        <H6>Forgot your password?</H6> <LinkText>Reset it now!</LinkText>
                    </PasswordReset>
                )}

            <Container.Footer>
                <Button
                    title={buttonText}
                    onPress={handleSubmit}
                    disabled={disabled}
                    loading={submitting}
                />
            </Container.Footer>
        </Container>
    );
};

PasscodeForm.defaultProps = {
    title: {
        sms: 'Enter Confirmation Code',
        password: 'Enter Password',
    },
    description: {
        sms:
            'Please enter the Confirmation Code that was texted to your mobile device.',
        password: [
            'Enter in your existing password or create your password below.',
            'Your password must be 6-20 characters in length',
        ],
    },
    buttonText: 'Submit',
    inputLabel: {
        sms: 'Confirmation Code',
        password: 'Password',
    },
};

PasscodeForm.propTypes = {
    titleText: PropTypes.shape({
        sms: PropTypes.string,
        password: PropTypes.string,
    }),
    description: PropTypes.shape({
        sms: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
        password: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
    }),
    inputLabel: PropTypes.shape({
        sms: PropTypes.string,
        password: PropTypes.string,
    }),
    buttonText: PropTypes.string,
};

PasscodeForm.navigationOptions = {
    header: null,
    gesturesEnabled: false,
};

PasscodeForm.LegalText = LegalText;

export default PasscodeForm;
