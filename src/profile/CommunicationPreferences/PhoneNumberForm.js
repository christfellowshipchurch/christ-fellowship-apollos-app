import React from 'react'
import { useMutation } from 'react-apollo'
import { withFormik } from 'formik'
import { get } from 'lodash'

import {
    Switch,
    TextInput
} from '@apollosproject/ui-kit'
import { FormCard } from 'ChristFellowship/src/ui/Cards'
import { UDPATE_PHONE_NUMBER, UPDATE_SMS_PREFERENCE } from './mutations'

const PhoneNumberForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
    touched,
    allowSMSText = 'Allow Text Notifications'
}) => {
    const [updatePhoneNumber] = useMutation(UDPATE_PHONE_NUMBER, {
        update: () => setSubmitting(false)
    })
    const [updateSMSPreference] = useMutation(UPDATE_SMS_PREFERENCE, {
        update: () => setSubmitting(false)
    })

    return (
        <FormCard title={get(values, 'title')} isLoading={isSubmitting}>
            <TextInput
                label={'Cell Phone'}
                type={'text'}
                textContentType={'telephoneNumber'} // ios autofill
                returnKeyType={'next'}
                value={get(values, 'phoneNumber')}
                error={
                    get(touched, 'phoneNumber', false) &&
                    get(errors, 'phoneNumber', null)
                }
                onChangeText={(text) => setFieldValue('phoneNumber', text)}
                onSubmitEditing={() => {
                    setSubmitting(true)
                    updatePhoneNumber({ variables: { phoneNumber: get(values, 'phoneNumber') } })
                }}
            />

            <Switch
                label={allowSMSText}
                value={get(values, 'allowSMS')}
                onValueChange={(allow) => {
                    setSubmitting(true)
                    updateSMSPreference({ variables: { allow } })
                    setFieldValue('allowSMS', allow)
                }} />
        </FormCard>
    )
}

const FormikForm = ({ onSubmit, initialValues, isInitialValid, allowSMSText, title }) => {
    const Form = withFormik({
        mapPropsToValues: () => ({ ...initialValues, title }),
        onSubmit,
        initialValues: { ...initialValues, title },
        isInitialValid,
        allowSMSText
    })(PhoneNumberForm)

    return <Form />
}

export default FormikForm