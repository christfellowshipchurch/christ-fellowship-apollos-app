import React from 'react'
import { useMutation } from 'react-apollo'
import { withFormik } from 'formik'
import { get } from 'lodash'

import {
    Switch,
    TextInput
} from '@apollosproject/ui-kit'
import { FormCard } from 'ChristFellowship/src/ui/Cards'
import { UPDATE_EMAIL, UPDATE_EMAIL_PREFERENCE } from './mutations'

const EmailForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
    touched,
    allowEmailText = 'Allow Email Notifications'
}) => {
    const [updateEmail] = useMutation(UPDATE_EMAIL, {
        update: () => setSubmitting(false)
    })
    const [updateEmailPreference] = useMutation(UPDATE_EMAIL_PREFERENCE, {
        update: () => setSubmitting(false)
    })

    return (
        <FormCard title={get(values, 'title')} isLoading={isSubmitting}>
            <TextInput
                label={'Email'}
                type={'email'}
                textContentType={'emailAddress'} // ios autofill
                returnKeyType={'next'}
                value={get(values, 'email')}
                error={
                    get(touched, 'email', false) &&
                    get(errors, 'email', null)
                }
                onChangeText={(text) => setFieldValue('email', text)}
                disabled={isSubmitting}
                onSubmitEditing={() => {
                    setSubmitting(true)
                    updateEmail({ variables: { email: get(values, 'email') } })
                }}
            />
            <Switch
                label={allowEmailText}
                value={get(values, 'allowEmail')}
                onValueChange={(allow) => {
                    setSubmitting(true)
                    updateEmailPreference({ variables: { allow } })
                    setFieldValue('allowEmail', allow)
                }} />

        </FormCard>
    )
}

const FormikForm = ({ onSubmit, initialValues, isInitialValid, title }) => {
    const Form = withFormik({
        mapPropsToValues: () => ({ ...initialValues, title }),
        onSubmit,
        initialValues: { ...initialValues, title },
        isInitialValid,
    })(EmailForm)

    return <Form />
}

export default FormikForm