import React from 'react'
import { get } from 'lodash'
import { ApolloConsumer } from 'react-apollo'
import moment from 'moment'
import { withFormik } from 'formik'
import Form from './form'
import * as Yup from 'yup'
import { UPDATE_PROFILE, HANDLE_LOGIN } from './mutations'

const handleSubmit = async (
    { firstName, lastName, gender = "Unknown", birthDate },
    { setSubmitting, setErrors, props: { client, navigation, username, password } }) => {
    if (username && password) {
        try {
            client.mutate({
                mutation: UPDATE_PROFILE,
                variables: {
                    username,
                    password,
                    firstName,
                    lastName,
                    gender,
                    birthDate
                },
                update: (cache, { data: { relateUserLoginToPerson: { token } } }) => {
                    if (token) {
                        try {
                            client.mutate({
                                mutation: HANDLE_LOGIN,
                                variables: {
                                    authToken: token
                                },
                                update: () => {
                                    navigation.navigate('EnableNotifications')
                                }
                            })
                        } catch (e) {
                            setErrors({ general: "An error occurred. Please try again" })
                        }
                    } else {
                        setErrors({ general: "An error occurred. Please try again" })
                    }
                }
            })
        } catch (e) {
            console.log("There was error submitting the form", { e })
            setSubmitting(false)
        }
    } else {
        setErrors({ general: "An error occurred. Please try again" })
        setSubmitting(false)
    }
}

const ProfileInformationForm = withFormik({
    validationSchema: Yup.object().shape({
        firstName: Yup.string().required('Please enter your first name'),
        lastName: Yup.string().required('Please enter your last name'),
        birthDate: Yup.string()
            .required('Make sure you have selected your birthday')
            .test(
                'birthDate',
                'We’re sorry, you must be 13 years of age or older to use this app. Please see your campus location page for CF Kids services and programs available to you at our church.',
                value => {
                    return moment().diff(moment(value), 'years') >= 13;
                }
            )
    }),
    handleSubmit
})(Form);

const ProfileInformation = (props) => {
    props = {
        ...props,
        username: get(props, 'navigation.state.params.username', null),
        password: get(props, 'navigation.state.params.password', null)
    }

    return (
        <ApolloConsumer>
            {(client) => <ProfileInformationForm {...props} client={client} />}
        </ApolloConsumer>
    )
}

ProfileInformation.navigationOptions = {
    header: null,
    gesturesEnabled: false
}


export default ProfileInformation;
