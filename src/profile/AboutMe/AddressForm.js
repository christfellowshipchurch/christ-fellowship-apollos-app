import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { withFormik } from 'formik'
import { has, get } from 'lodash'

import {
    styled,
    H5,
    Button,
} from '@apollosproject/ui-kit'

import { TextInput, Picker, PickerItem } from 'ChristFellowship/src/ui/inputs'
import { FormCard } from 'ChristFellowship/src/ui/Cards'

import { GET_STATES_LIST } from './queries'

const ErrorMessage = styled(({ theme }) => ({
    color: theme.colors.alert
}))(H5)

const StateSelect = ({ value = '', placeholder, onChange }) => {
    const { data } = useQuery(GET_STATES_LIST, { fetchPolicy: "cache-and-network" })
    const [selectedValue, setSelectedValue] = useState(value)
    const values = get(data, 'getStatesList.values', [])

    return (
        <Picker
            placeholder={placeholder}
            label="State"
            value={selectedValue}
            displayValue={selectedValue}
            onValueChange={(state) => {
                setSelectedValue(state)
                onChange(state)
            }}
            icon='map-marked-alt'>
            {values.map((n, i) =>
                <PickerItem label={n.value} value={n.value} key={i} />
            )}
        </Picker>
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
    handleSubmit,
}) => {
    const title = get(values, 'title')
    const [inputChanged, setInputChanged] = useState(false)
    const disabled = isSubmitting
        || !inputChanged
        || !get(values, 'street1', null)
        || !get(values, 'city', null)
        || !get(values, 'postalCode', null)
        || !get(values, 'state', null)
        || true

    const onChangeText = (key, value) => {
        setInputChanged(true)
        setFieldValue(key, value)
    }

    return (
        <FormCard title={title} isLoading={isSubmitting}>
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
                icon='home'
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
                icon='map-marked-alt'
            />

            <StateSelect
                value={get(values, 'state')}
                onChange={(state) => onChangeText('state', state)} />

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
                icon='map-marked-alt'
            />

            <Button
                disabled={disabled}
                onPress={handleSubmit}
                title="Update Address"
                loading={isSubmitting}
            />
        </FormCard>
    )
}

const FormikForm = ({ onSubmit, initialValues, isInitialValid, title }) => {
    const Form = withFormik({
        mapPropsToValues: () => ({ ...initialValues, title }),
        onSubmit,
        initialValues: { ...initialValues, title },
        isInitialValid,
    })(AddressForm)

    console.log({ title })

    return <Form />
}

export default FormikForm