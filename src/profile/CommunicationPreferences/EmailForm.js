import React from 'react'
import { Mutation } from 'react-apollo'
import { withFormik } from 'formik'
import { has, get } from 'lodash'

import {
    ActivityIndicator,
    BackgroundView,
    PaddedView,
    FlexedView,
    styled,
    H5,
    Switch,
    TextInput
} from '@apollosproject/ui-kit'

import { UPDATE_EMAIL, UPDATE_EMAIL_PREFERENCE } from './mutations'


const ErrorMessage = styled(({ theme }) => ({
    color: theme.colors.alert
}))(H5)

const Overlay = styled(() => ({
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, .75)',
    top: 0,
    left: 0,
    zIndex: 1
}))(FlexedView)

const ActivityIndicatorOverlay = () => (
    <Overlay>
        <ActivityIndicator />
    </Overlay>
)

const EmailForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
    touched,
    allowEmailText = 'Allow Email Notifications'
}) => (
        <FlexedView>
            <BackgroundView>
                <PaddedView>
                    {has(errors, 'email') && <ErrorMessage>Something went wrong... so so terribly wrong... sorry</ErrorMessage>}

                    <Mutation
                        mutation={UPDATE_EMAIL}
                        update={(cache, { data }) => setSubmitting(false)} >
                        {(updateEmail) => (
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
                        )}
                    </Mutation>

                    <Mutation
                        mutation={UPDATE_EMAIL_PREFERENCE}
                        update={(cache, { data }) => setSubmitting(false)} >
                        {(updateEmailPreference) => (
                            <Switch
                                label={allowEmailText}
                                value={get(values, 'allowEmail')}
                                onValueChange={(allow) => {
                                    setSubmitting(true)
                                    updateEmailPreference({ variables: { allow } })
                                    setFieldValue('allowEmail', allow)
                                }} />
                        )}
                    </Mutation>

                </PaddedView>
            </BackgroundView>
            {isSubmitting && <ActivityIndicatorOverlay />}
        </FlexedView>
    )

const FormikForm = ({ onSubmit, initialValues, isInitialValid }) => {
    const Form = withFormik({
        mapPropsToValues: () => initialValues,
        onSubmit,
        initialValues,
        isInitialValid,
    })(EmailForm)

    return <Form />
}

export default FormikForm