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

import { UPDATE_SMS_PREFERENCE } from './mutations'


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

const PhoneNumberForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
    touched,
    allowSMSText = 'Allow Text Notifications'
}) => (
        <FlexedView>
            <BackgroundView>
                <PaddedView>
                    {has(errors, 'phoneNumber') && <ErrorMessage>Something went wrong... so so terribly wrong... sorry</ErrorMessage>}

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
                        disabled={true}
                        enablesReturnKeyAutomatically
                    />

                    <Mutation
                        mutation={UPDATE_SMS_PREFERENCE}
                        update={(cache, { data }) => setSubmitting(false)} >
                        {(updateSMSPreference) => (
                            <Switch
                                label={allowSMSText}
                                value={get(values, 'allowSMS')}
                                onValueChange={(allow) => {
                                    setSubmitting(true)
                                    updateSMSPreference({ variables: { allow } })
                                    setFieldValue('allowSMS', allow)
                                }} />
                        )}
                    </Mutation>
                </PaddedView>
            </BackgroundView>
            {isSubmitting && <ActivityIndicatorOverlay />}
        </FlexedView>
    )

const FormikForm = ({ onSubmit, initialValues, isInitialValid, allowSMSText }) => {
    const Form = withFormik({
        mapPropsToValues: () => initialValues,
        onSubmit,
        initialValues,
        isInitialValid,
        allowSMSText
    })(PhoneNumberForm)

    return <Form />
}

export default FormikForm