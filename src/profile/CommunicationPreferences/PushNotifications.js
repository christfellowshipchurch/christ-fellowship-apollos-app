import React from 'react'
import { withFormik } from 'formik'
import { get } from 'lodash'
import PushNotification from 'react-native-push-notification'

import {
    Button
} from '@apollosproject/ui-kit'
import { FormCard } from 'ChristFellowship/src/ui/Cards'

const PushNotificationForm = ({
    values,
}) => PushNotification.checkPermissions(({ alert, sound, badge }) => !!(alert || sound || badge)
    ? null
    : (
        <FormCard title={get(values, 'title')} isLoading={isSubmitting}>
            <Button
                title="Enable Push Notifications"
                onPress={() => PushNotification.requestPermissions()} />
        </FormCard>
    )
)

const FormikForm = ({ onSubmit, initialValues, isInitialValid, title }) => {
    const Form = withFormik({
        mapPropsToValues: () => ({ ...initialValues, title }),
        onSubmit,
        initialValues: { ...initialValues, title },
        isInitialValid,
    })(PushNotificationForm)

    return <Form />
}

export default FormikForm