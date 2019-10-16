import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Query, Mutation, useQuery, useMutation } from 'react-apollo'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { has, get } from 'lodash'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'

import {
    ActivityIndicator,
    FlexedView,
    styled,
    H5,
    H6,
    Icon,
    Touchable,
} from '@apollosproject/ui-kit'

import { FormCard } from 'ChristFellowship/src/ui/Cards'
import { TextInput, DateInput, Picker, PickerItem, Radio, RadioButton } from 'ChristFellowship/src/ui/inputs'

import { UDPATE_GENDER, UPDATE_BIRTHDATE, UPDATE_ETHNICITY } from './mutations'
import { GET_ETHNICITY_LIST } from './queries'

const ErrorMessage = styled(({ theme }) => ({
    color: theme.colors.alert
}))(H5)

const Label = styled(({ theme, padded }) => ({
    color: 'gray',
    opacity: 0.7,
    ...(padded ? { marginTop: theme.sizing.baseUnit } : {}),
}))(H6)

const GenderSelect = ({ value, genderList, onChange, onSuccess, onError }) => (
    <Mutation
        mutation={UDPATE_GENDER}
        update={(cache, { data }) => onSuccess(get(data, 'updateProfileFields', { gender: '' }))}
    >
        {(updateGender) => (
            <>
                <Radio
                    label="Gender"
                    type="radio"
                    value={value}
                    onChange={async (gender) => {
                        onChange()
                        try {
                            await updateGender({ variables: { gender } })
                        } catch (e) {
                            onError(e)
                        }
                    }}
                >
                    {genderList.map((gender) => [
                        <RadioButton
                            key={gender}
                            value={gender}
                            label={gender}
                            underline={false}
                        />,
                    ])}
                </Radio>
            </>
        )}
    </Mutation>
)

const BirthDateSelect = ({ value, onChange, onSuccess, onError }) => {

    const [showDateTimePicker, setShowDateTimePicker] = useState(false)

    return (
        <Mutation
            mutation={UPDATE_BIRTHDATE}
            update={(cache, { data }) => onSuccess(get(data, 'updateProfileFields', { birthDate: null }))}
        >
            {(updateBirthDate) => (
                <DateInput
                    label='Birth Date'
                    value={moment(value).format('MMM D, YYYY')}
                    displayValue={
                        // only show a birthday if we have one.
                        value // DatePicker shows displayValue > placeholder > label in that order
                            ? moment(value).format('MMM D, YYYY')
                            : '' // Pass an empty string if we don't have a birthday to show the placeholder.
                    }
                    isVisible={showDateTimePicker}
                    onConfirm={(birthDate) => {
                        onChange()

                        try {
                            updateBirthDate({ variables: { birthDate } })
                        } catch (e) {
                            onError(e)
                        }

                        setShowDateTimePicker(false)
                    }}
                    onCancel={() => setShowDateTimePicker(false)}
                />
            )}
        </Mutation>
    )
}

const EthnicitySelect = ({ value = '', placeholder, onChange, onSuccess }) => {
    const { loading, error, data } = useQuery(GET_ETHNICITY_LIST, {
        fetchPolicy: "cache-and-network"
    })
    const [updateEthnicity] = useMutation(UPDATE_ETHNICITY, {
        update: (cache, { data }) =>
            onSuccess(get(data, 'updateProfileFields', { ethnicity: null }))
    })
    const [selectedValue, setSelectedValue] = useState(value)

    const values = get(data, 'getEthnicityList.values', [])

    return (
        <Picker
            icon='user'
            placeholder={placeholder}
            label="Ethnicity"
            value={selectedValue}
            displayValue={selectedValue}
            onValueChange={(ethnicity) => {
                setSelectedValue(ethnicity)
                onChange(ethnicity)
                try {
                    updateEthnicity({ variables: { ethnicity } })
                } catch (e) {
                    onError(e)
                }

            }} >
            {values.map((n, i) => <PickerItem label={n.value} value={n.value} key={i} />
            )}
        </Picker>
    )
}

const InfoForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
    genderList = ['Male', 'Female'],
    birthDatePlaceholder = 'Select Birth Date',
    ethnicityPlaceholder = 'Select Ethnicity',
}) => (
        <FormCard title={get(values, 'title')} isLoading={isSubmitting}>
            {has(errors, 'info') && <ErrorMessage>Something went wrong... so so terribly wrong... sorry</ErrorMessage>}
            <GenderSelect
                value={get(values, 'gender')}
                genderList={genderList}
                onChange={() => setSubmitting(true)}
                onSuccess={({ gender }) => {
                    setFieldValue('gender', gender)
                    setSubmitting(false)
                }}
                onError={(e) => {
                    setSubmitting(false)
                    // TODO : error handling
                }} />

            <BirthDateSelect
                value={has(values, 'birthDate')
                    ? moment
                        .utc(get(values, 'birthDate'))
                        .format('MMM DD, YYYY')
                    : birthDatePlaceholder}
                onChange={() => setSubmitting(true)}
                onSuccess={({ birthDate }) => {
                    setFieldValue('birthDate', birthDate)
                    setSubmitting(false)
                }}
                onError={(e) => {
                    setSubmitting(false)
                    // TODO : error handling
                }} />

            <EthnicitySelect
                value={get(values, 'ethnicity', '')}
                onChange={() => setSubmitting(true)}
                onSuccess={({ ethnicity }) => {
                    setFieldValue('ethnicity', ethnicity)
                    setSubmitting(false)
                }}
                placeholder={ethnicityPlaceholder} />

        </FormCard>
    )

const FormikForm = ({ onSubmit, initialValues, isInitialValid, title }) => {
    const Form = withFormik({
        mapPropsToValues: () => ({ ...initialValues, title }),
        validationSchema: Yup.object().shape({

        }),
        onSubmit,
        initialValues: { ...initialValues, title },
        isInitialValid,
    })(InfoForm)

    return <Form />
}

export default FormikForm