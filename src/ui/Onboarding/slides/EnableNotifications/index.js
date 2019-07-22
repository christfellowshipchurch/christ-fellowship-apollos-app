import React from 'react'
import PropTypes from 'prop-types'
import { ApolloConsumer } from 'react-apollo'
import { get } from 'lodash'
import { withFormik } from 'formik'
import Form from './form'
import * as Yup from 'yup'
import { UPDATE_PROFILE } from './mutations'

const handleSubmit = async ({ firstName, lastName, gender, birthDate }, { setSubmitting, props: { client } }) => {
    try {
        client.mutate({
            mutation: UPDATE_PROFILE,
            variables: {
                firstName,
                lastName,
                gender,
                birthDate
            },
            update: (cache, { data: { updateProfileFields: { id } } }) => {
                console.log("Updated Person Record")
            }
        })
    } catch (e) {
        console.log("There was error submitting the form", { e })
    }
    setSubmitting(false)
}

const ProfileInformationForm = withFormik({
    validationSchema: Yup.object().shape({
        firstName: Yup.string().required('Please enter your first name'),
        lastName: Yup.string().required('Please enter your last name'),
        gender: Yup.string().required('Please make sure you have entered a valid password'),
        birthDate: Yup.string().required('Please make sure you have entered a valid password')
    }),
    handleSubmit
})(Form);

const ProfileInformation = (props) => (
    <ApolloConsumer>
        {(client) => <ProfileInformationForm {...props} client={client} />}
    </ApolloConsumer>
)

ProfileInformation.displayName = 'ProfileInformation';

export default ProfileInformation;
