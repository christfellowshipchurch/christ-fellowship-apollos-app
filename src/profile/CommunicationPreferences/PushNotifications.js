import React from 'react'
import { useMutation } from 'react-apollo'
import { withFormik } from 'formik'
import { get } from 'lodash'

import {
    Switch,
    TextInput,
    Button
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
}) => false
        ? null
        : (
            <FormCard title={get(values, 'title')} isLoading={isSubmitting}>
                <Button
                    title="Enable Push Notifications"
                    onPress={() => PushNotifications.request({ trigger: 'user' })} />
            </FormCard>
        )

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