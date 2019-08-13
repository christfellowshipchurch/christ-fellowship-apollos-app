import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Query, Mutation } from 'react-apollo'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { has, get } from 'lodash'
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
    PickerItem,
    Icon,
    Touchable,
} from '@apollosproject/ui-kit'

import { UDPATE_GENDER, UPDATE_BIRTHDATE, UPDATE_ETHNICITY } from './mutations'
import { GET_ETHNICITY_LIST } from './queries'

const ErrorMessage = styled(({ theme }) => ({
    color: theme.colors.alert
}))(H5)

const StyledRadio = styled(({ theme }) => ({
    marginBottom: theme.sizing.baseUnit,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
}))(Radio)

const RadioLabel = styled(({ theme }) => ({
    marginLeft: theme.sizing.baseUnit * 0.5,
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

const GenderSelect = ({ value, genderList, onChange, onSuccess, onError }) => (
    <Mutation
        mutation={UDPATE_GENDER}
        update={(cache, { data }) => onSuccess(get(data, 'updateProfileFields', { gender: '' }))}
    >
        {(updateGender) => (
            <>
                <Label padded>Gender</Label>
                <StyledRadio
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
                            label={() => <RadioLabel>{gender}</RadioLabel>}
                            underline={false}
                        />,
                    ])}
                </StyledRadio>
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
                <>
                    <Label padded>Birth Date</Label>
                    <DropDown
                        value={value}
                        icon='profile'
                        onPress={() => setShowDateTimePicker(true)} />
                    <DateTimePicker
                        date={moment.utc(value).toDate()}
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
                </>
            )}
        </Mutation>
    )
}

const EthnicitySelect = ({ value = '', placeholder, onChange }) => {
    const [selectedValue, setSelectedValue] = useState(value)
    return (
        <Query query={GET_ETHNICITY_LIST} fetchPolicy="cache-and-network">
            {({ data, loading, error }) => {
                const disabled = loading || error
                const values = get(data, 'getEthnicityList.values', [])

                return (
                    <>
                        <Label padded>Ethnicity</Label>
                        <Picker
                            placeholder={placeholder}
                            label=""
                            value={selectedValue}
                            displayValue={selectedValue}
                            onValueChange={(ethnicity) => {
                                setSelectedValue(ethnicity)
                                onChange(ethnicity)
                            }}>
                            {values.map((n, i) => {
                                console.log({ n })
                                return <PickerItem label={n.value} value={n.value} key={i} />
                            })}
                        </Picker>
                    </>
                )
            }}
        </Query>
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
        <FlexedView>
            <BackgroundView>
                <PaddedView>
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
                        value={get(values, 'ethnicity', ethnicityPlaceholder)}
                        placeholder={ethnicityPlaceholder} />

                </PaddedView>
            </BackgroundView>
            {isSubmitting && <ActivityIndicatorOverlay />}
        </FlexedView>
    )

const FormikForm = ({ onSubmit, initialValues, isInitialValid }) => {
    const Form = withFormik({
        mapPropsToValues: () => initialValues,
        validationSchema: Yup.object().shape({

        }),
        onSubmit,
        initialValues,
        isInitialValid,
    })(InfoForm)

    return <Form />
}

export default FormikForm