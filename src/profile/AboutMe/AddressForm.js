import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Query, Mutation } from 'react-apollo'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { has, get, isEmpty } from 'lodash'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'

import {
    ActivityIndicator,
    BackgroundView,
    PaddedView,
    FlexedView,
    styled,
    H5,
    H6,
    Radio,
    RadioButton,
    DateInput,
    Picker,
    Icon,
    Touchable,
    TextInput,
    Button
} from '@apollosproject/ui-kit'

import { GET_STATES_LIST } from './queries'

const ErrorMessage = styled(({ theme }) => ({
    color: theme.colors.alert
}))(H5)


const Label = styled(({ theme, padded }) => ({
    color: 'gray',
    opacity: 0.7,
    ...(padded ? { marginTop: theme.sizing.baseUnit } : {}),
}))(H6)

const DropDownContainer = styled(({ theme }) => ({
    padding: theme.sizing.baseUnit * 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: theme.colors.background.inactive,
    borderBottomWidth: StyleSheet.hairlineWidth
}))(FlexedView)

const DropDownValue = styled(({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit,
    flex: 3
}))(H5)

const DropDownIcon = styled(({ theme }) => ({
    flex: 1,
    alignContent: 'center'
}))(Icon)

const DropDown = ({ icon, value, onPress, ...props }) => (
    <Touchable onPress={onPress} {...props}>
        <DropDownContainer>
            <DropDownIcon name={icon} size={20} />
            <DropDownValue>{value}</DropDownValue>
            <DropDownIcon name='arrow-down' size={20} />
        </DropDownContainer>
    </Touchable>
)

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

// TODO : make my own Picker
const StateSelect = ({ value = '', placeholder, onChange }) => {
    const [selectedValue, setSelectedValue] = useState(value)
    return (
        <Query query={GET_STATES_LIST} fetchPolicy="cache-and-network">
            {({ data, loading, error }) => {
                const disabled = loading || error
                const values = get(data, 'getStatesList.values', [])

                return (
                    <Picker
                        placeholder={placeholder}
                        label="State"
                        value={selectedValue}
                        displayValue={selectedValue}
                        onValueChange={(ethnicity) => {
                            console.log({ ethnicity })
                            setSelectedValue(ethnicity)
                            onChange(ethnicity)
                        }}>
                        {values.map((n, i) => {
                            console.log({ n })
                            return <Picker.Item label={n.value} value={n.value} key={i} />
                        })}
                    </Picker>
                )
            }}
        </Query>
    )
}

const AddressForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
    isLoading,
    touched,
    handleSubmit
}) => {
    const [inputChanged, setInputChanged] = useState(false)
    const disabled = isSubmitting
        || !inputChanged
        || !get(values, 'street1', null)
        || !get(values, 'city', null)
        || !get(values, 'postalCode', null)
        || !get(values, 'state', null)

    const onChangeText = (key, value) => {
        setInputChanged(true)
        setFieldValue(key, value)
    }

    return (
        <FlexedView>
            <BackgroundView>
                <PaddedView>
                    {has(errors, 'info') && <ErrorMessage>Something went wrong... so so terribly wrong... sorry</ErrorMessage>}

                    <TextInput
                        label={'Street Address'}
                        type={'text'}
                        textContentType={'fullStreetAddress'} // ios autofill
                        returnKeyType={'next'}
                        value={get(values, 'street1')}
                        error={
                            get(touched, 'street1', false) &&
                            get(errors, 'street1', null)
                        }
                        onChangeText={(text) => onChangeText('street1', text)}
                        disabled={isLoading}
                        enablesReturnKeyAutomatically
                    />

                    <TextInput
                        label={'City'}
                        type={'text'}
                        textContentType={'addressCity'} // ios autofill
                        returnKeyType={'next'}
                        value={get(values, 'city')}
                        error={
                            get(touched, 'city', false) &&
                            get(errors, 'city', null)
                        }
                        onChangeText={(text) => onChangeText('city', text)}
                        disabled={isLoading}
                        enablesReturnKeyAutomatically
                    />

                    {/* <StateSelect value={get(values, 'state')} /> */}

                    <TextInput
                        label={'Zip Code'}
                        type={'text'}
                        textContentType={'postalCode'} // ios autofill
                        returnKeyType={'next'}
                        value={get(values, 'postalCode')}
                        error={
                            get(touched, 'postalCode', false) &&
                            get(errors, 'postalCode', null)
                        }
                        onChangeText={(text) => onChangeText('postalCode', text)}
                        disabled={isLoading}
                        enablesReturnKeyAutomatically
                    />

                    {/* <Button
                        disabled={disabled}
                        onPress={handleSubmit}
                        title="Update Address"
                        loading={isSubmitting}
                    /> */}

                </PaddedView>
            </BackgroundView>
            {isSubmitting && <ActivityIndicatorOverlay />}
        </FlexedView>
    )
}

const FormikForm = ({ onSubmit, initialValues, isInitialValid }) => {
    const Form = withFormik({
        mapPropsToValues: () => initialValues,
        validationSchema: Yup.object().shape({

        }),
        onSubmit,
        initialValues,
        isInitialValid,
    })(AddressForm)

    return <Form />
}

export default FormikForm