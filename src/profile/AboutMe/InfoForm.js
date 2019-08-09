import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Mutation } from 'react-apollo'
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
    Icon,
    Touchable
} from '@apollosproject/ui-kit'

import { UDPATE_GENDER, UPDATE_BIRTHDATE, UPDATE_ETHNICITY } from './mutations'

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

const StyledDate = styled(({ theme }) => ({
    marginTop: 0,
    marginBottom: theme.sizing.baseUnit,
}))(DateInput)

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

const InfoForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
    genderList = ['Male', 'Female'],
    birthDatePlaceholder = 'Select Birth Date',
    ethnicityPlaceholder = 'Select Ethnicity',
}) => {
    const [showDateTimePicker, setShowDateTimePicker] = useState(false)

    return (
        <FlexedView>
            <BackgroundView>
                <PaddedView>
                    <Mutation
                        mutation={UDPATE_GENDER}
                        update={(cache, { data }) => {
                            setFieldValue('gender', get(data, 'updateProfileFields.gender'))
                            setSubmitting(false)
                        }} >
                        {(updateGender) => (
                            <>
                                <Label padded>Gender</Label>
                                <StyledRadio
                                    label="Gender"
                                    type="radio"
                                    value={get(values, 'gender')}
                                    error={get(errors, 'gender', null)}
                                    onChange={async (gender) => {
                                        setSubmitting(true)
                                        try {
                                            await updateGender({ variables: { gender } })
                                        } catch (e) {
                                            console.log({ e })
                                            setSubmitting(false)
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

                    <Mutation
                        mutation={UPDATE_BIRTHDATE}
                        update={(cache, { data }) => {
                            setFieldValue('birthDate', get(data, 'updateProfileFields.birthDate'))
                            setSubmitting(false)
                        }} >
                        {(updateBirthDate) => (
                            <>
                                <Label padded>Birth Date</Label>
                                <DropDown
                                    value={has(values, 'birthDate')
                                        ? moment
                                            .utc(get(values, 'birthDate'))
                                            .format('MMM DD, YYYY')
                                        : birthDatePlaceholder}
                                    icon='profile'
                                    onPress={() => setShowDateTimePicker(true)} />
                                <DateTimePicker
                                    date={moment
                                        .utc(get(values, 'birthDate', new Date()))
                                        .toDate()}
                                    isVisible={showDateTimePicker}
                                    onConfirm={(birthDate) => {
                                        setSubmitting(true)

                                        try {
                                            updateBirthDate({ variables: { birthDate } })
                                        } catch (e) {
                                            console.log({ e })
                                        }

                                        setShowDateTimePicker(false)
                                    }}
                                    onCancel={() => setShowDateTimePicker(false)}
                                />
                            </>
                        )}
                    </Mutation>

                    <Label padded>Ethnicity</Label>
                    <DropDown
                        value={get(values, 'ethnicity', ethnicityPlaceholder)}
                        icon='profile'
                        disabled
                    />
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
    })(InfoForm)

    return <Form />
}

export default FormikForm