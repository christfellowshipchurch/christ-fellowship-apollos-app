import React from 'react'
import PropTypes from 'prop-types'
import { ApolloConsumer } from 'react-apollo'
import { get } from 'lodash'
import { withFormik } from 'formik'
import Form from './form'
import * as Yup from 'yup'
import { AUTHENTICATE_CREDENTIALS, HANDLE_LOGIN, HANDLE_NEW_LOGIN, CREATE_NEW_LOGIN } from './mutations'

const handleLogin = ({ client, navigation, authToken, isExistingIdentity, identity, passcode }) => {
    client.mutate({
        mutation: HANDLE_LOGIN,
        variables: {
            authToken
        },
        update: () => {
            if (isExistingIdentity)
                navigation.navigate('Tabs')
            else
                navigation.navigate('ProfileInformation', { username: identity, password: passcode })
        }
    })
}

const handleNewUser = async ({ client, identity, passcode, onUpdate, onError }) => {
    try {
        client.mutate({
            mutation: CREATE_NEW_LOGIN,
            variables: {
                identity,
                passcode
            },
            update: (cache, { data }) => onUpdate(data)
        })
    } catch (e) {
        console.log("Create new login error:", { e })
        onError(e)
    }
}

const authenticateUserLogin = async ({ client, identity, passcode, onUpdate, onError }) => {
    try {
        await client.mutate({
            mutation: AUTHENTICATE_CREDENTIALS,
            variables: {
                username: identity,
                password: passcode
            },
            update: (cache, { data }) => onUpdate(data)
        })
    } catch (e) {
        console.log("Authenticate credentials error:", { e })

        onError(e)
    }
}

const handleSubmit = async (
    { password },
    { setSubmitting, setErrors, props: { client, type, username, navigation, isExistingIdentity } }) => {

    const identity = username
    const passcode = password
    setSubmitting(true)

    // check for valid login types
    if (type === 'sms' || type === 'password') {
        // isExisitingIdentity checks for an existing Sms login
        // password logins aren't known to be existing or not until the authentication is run
        if (isExistingIdentity) {
            authenticateUserLogin({
                client,
                identity: username,
                passcode: password,
                onUpdate: ({ authenticateCredentials: { token } }) => {
                    // successful login on an existing Sms User Login

                    console.log({ token })
                    if (token) {
                        handleLogin({
                            client,
                            navigation,
                            authToken: token,
                            isExistingIdentity,
                            identity,
                            passcode
                        })
                    } else {
                        setErrors({
                            password: "Sorry! We are unable to log you in at this time"
                        })
                    }
                },
                onError: ({ graphQLErrors }) => {
                    // checks for graphql authentication error
                    if (
                        graphQLErrors && graphQLErrors.length
                        && graphQLErrors.find(({ extensions }) => extensions.code === 'UNAUTHENTICATED')
                    ) {
                        // the code or password entered was for an existing user login and was incorrect
                        const errorLanguage = {
                            sms: 'confirmation code',
                            password: 'password'
                        }

                        setErrors({
                            password: `The ${errorLanguage[type]} you entered is incorrect`
                        })
                    } else {
                        setErrors({
                            password: 'Unknown error. Please try again later.'
                        })
                    }
                }
            })
        } else {
            handleNewUser({
                client,
                identity: username,
                passcode: password,
                onUpdate: ({ createNewUserLogin: { token } }) => {
                    // if a token exists, the account was successfully created and authenticated
                    if (token) {
                        handleLogin({
                            client,
                            navigation,
                            authToken: token,
                            isExistingIdentity,
                            identity,
                            passcode
                        })
                    } else {
                        setErrors({
                            password: "Sorry! We are unable to log you in at this time"
                        })
                    }
                },
                onError: () => {
                    setErrors({
                        password: "There was an issue creating your account. Please try again"
                    })
                }
            })
        }
    } else {
        setErrors({
            password: "Something went wrong! Try closing the app before logging in again"
        })

        setSubmitting(false)
    }
}

const PasscodeForm = withFormik({
    mapPropsToValues: () => ({ password: '' }),
    validationSchema: Yup.object().shape({
        password: Yup.string().required('Please make sure you have entered a valid password')
    }),
    handleSubmit
})(Form)

const Passcode = (props) => {
    const { type } = props
    const navType = get(props, 'navigation.state.params.type', null)

    props = {
        ...props,
        type: type || navType,
        username: get(props, 'navigation.state.params.username', ''),
        isExistingIdentity: get(props, 'navigation.state.params.isExistingIdentity', false)
    }

    console.log("Passcode", { props })

    return (
        <ApolloConsumer>
            {(client) => <PasscodeForm {...props} client={client} />}
        </ApolloConsumer>
    )
}

Passcode.displayName = 'Passcode';

Passcode.navigationOptions = {
    title: 'Passcode',
    header: null,
}

export default Passcode;
