import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-native'
import { ApolloConsumer } from 'react-apollo'
import { withFormik } from 'formik'
import Form from './form'
import * as Yup from 'yup'
import REQUEST_PIN from './requestPin'

const parseUsername = async (username) => {
    // remove all non-integer characters
    const digits = username.replace(/[^0-9]/gi, '')
    return {
        // Yup for email validation
        email: await Yup.string().email().isValid(username),
        // validation for 10 digit phone numbers (US numbers)
        phoneNumber: digits.length === 10
    }
}

const validate = async ({ username }) => {
    const validation = await parseUsername(username)

    validation.errors = !validation.email && !validation.phoneNumber
        ? { username: 'Please enter a valid phone number or email address' }
        : {}

    if (validation.errors) throw validation.errors
}

const handleSubmit = async ({ username }, { setSubmitting, props: { client } }) => {
    setSubmitting(true);
    try {
        const { email, phoneNumber } = await parseUsername(username)

        if (email) {
            Alert.alert(
                'Email',
                "You're attempting an email login",
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        } else if (phoneNumber) {
            client.mutate({
                mutation: REQUEST_PIN,
                variables: {
                    phoneNumber: username,
                },
                update: (cache, { data: { requestSmsLoginPin: { success } } }) => {
                    if (success) {
                        // navigate to Confirmation Code validation

                        Alert.alert(
                            'Phone Number',
                            "You successfully received an SMS Confirmation Code",
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ],
                            { cancelable: false },
                        );
                    } else {
                        // show some error on the screen
                    }
                }
            })
        }
    } catch (e) {
        console.log("There was error submitting the form", { e })
    }
    setSubmitting(false)
}

const UsernameForm = withFormik({
    mapPropsToValues: () => ({ username: '' }),
    validate,
    handleSubmit
})(Form);

const LandingPage = (props) => (
    <ApolloConsumer>
        {(client) => <UsernameForm {...props} client={client} />}
    </ApolloConsumer>
)

LandingPage.displayName = 'LandingPage';

export default LandingPage;
