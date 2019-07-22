import React from 'react'
import PropTypes from 'prop-types'
import { ApolloConsumer } from 'react-apollo'
import { get } from 'lodash'
import { withFormik } from 'formik'
import Form from './form'
import * as Yup from 'yup'
import { VERIFY_PIN, VERIFY_PASSWORD, HANDLE_LOGIN } from './mutations'

const handleSubmit = async ({ password }, { setSubmitting, setErrors, props: { client, type, username } }) => {
    setSubmitting(true)
    if (type === 'sms' || type === 'password') {
        try {
            client.mutate({
                mutation: type === 'sms' ? VERIFY_PIN : VERIFY_PASSWORD,
                variables: {
                    username,
                    password
                },
                update: (cache, { data }) => {
                    const smsToken = get(data, 'authenticateWithSms.token', null)
                    const passwordToken = get(data, 'authenticate.token', null)
                    const token = smsToken || passwordToken

                    if (token) {
                        // navigate to Confirmation Code validation

                        // login handler
                        client.mutate({
                            mutation: HANDLE_LOGIN,
                            variables: {
                                authToken: token,
                            },
                            update: (cache, data) => {
                                console.log('Handled Login', { data })
                            }
                        });
                    } else {
                        setErrors({
                            password: "The code entered is incorrect. Please try again."
                        })
                    }
                }
            })
        } catch (e) {
            console.log("There was error submitting the form", { e })
        }
    } else {
        setErrors({
            password: "Something went wrong! Try closing the app before logging in again"
        })
    }

    setSubmitting(false)
}

const PasscodeForm = withFormik({
    mapPropsToValues: () => ({ password: '' }),
    validationSchema: Yup.object().shape({
        password: Yup.string().required('Please make sure you have entered a valid password')
    }),
    handleSubmit
})(Form);

const Passcode = (props) => (
    <ApolloConsumer>
        {(client) => <PasscodeForm {...props} client={client} />}
    </ApolloConsumer>
)

Passcode.displayName = 'Passcode';

export default Passcode;
