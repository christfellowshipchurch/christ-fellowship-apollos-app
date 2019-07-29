import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-native'
import { ApolloConsumer } from 'react-apollo'
import { withFormik } from 'formik'
import Form from './form'
import * as Yup from 'yup'
import { REQUEST_PIN, IS_VALID_IDENTITY } from './mutations'

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

const handleSubmit = async ({ username }, { setSubmitting, props: { client, navigation } }) => {
    setSubmitting(true)
    const { email, phoneNumber } = await parseUsername(username)

    if (email) {
        try {
            client.mutate({
                mutation: IS_VALID_IDENTITY,
                variables: {
                    identity: username,
                },
                update: (cache, { data: { isValidIdentity: { success, isExistingIdentity } } }) => {
                    if (success) {
                        // navigate to Passcode validation
                        navigation.navigate('Passcode', { username, type: 'password', isExistingIdentity })
                    } else {
                        // show some error on the screen
                    }

                    setSubmitting(false)
                }
            })
        } catch (e) {
            console.log({ e })

            setSubmitting(false)
        }
    } else if (phoneNumber) {
        try {
            client.mutate({
                mutation: REQUEST_PIN,
                variables: {
                    phoneNumber: username,
                },
                update: (cache, { data: { requestSmsLoginPin: { success, isExistingIdentity } } }) => {
                    if (success) {
                        // navigate to Passcode validation
                        navigation.navigate('Passcode', { username, type: 'sms', isExistingIdentity })
                    } else {
                        // show some error on the screen
                    }

                    setSubmitting(false)
                }
            })
        } catch (e) {
            console.log({ e })

            setSubmitting(false)
        }
    }
    // setSubmitting(false)
}

const navigationToPrivacyPolicy = (navigation) => {
    navigation.navigate('PrivacyPolicy')
}

const UsernameForm = withFormik({
    mapPropsToValues: () => ({ username: '' }),
    validate,
    handleSubmit
})(Form);

const LandingPage = (props) => (
    <ApolloConsumer>
        {(client) => <UsernameForm {...props} client={client} navigateToPrivacyPolicy={navigationToPrivacyPolicy} />}
    </ApolloConsumer>
)

LandingPage.navigationOptions = {
    title: 'LandingPage',
    header: null,
    gesturesEnabled: false,
}

export default LandingPage;
