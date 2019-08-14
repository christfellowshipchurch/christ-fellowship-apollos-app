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
    Icon,
    Touchable,
} from '@apollosproject/ui-kit'

import { UPDATE_SALVATION, UPDATE_BAPTISM } from './mutations'

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

const DateSelect = ({ title, value, onChange, onSuccess, onError, mutation }) => {
    const [showDateTimePicker, setShowDateTimePicker] = useState(false)


    console.log({ mutation })
    return (
        <Mutation
            mutation={mutation}
            update={onSuccess} >
            {(mutate) => (
                <>
                    <Label padded>{title}</Label>
                    <DropDown
                        value={value}
                        icon='calendar'
                        onPress={() => setShowDateTimePicker(true)} />
                    <DateTimePicker
                        date={moment.utc(value).toDate()}
                        isVisible={showDateTimePicker}
                        onConfirm={(date) => {
                            setShowDateTimePicker(false)
                            onChange({ mutate, date })
                        }}
                        onCancel={() => setShowDateTimePicker(false)}
                    />
                </>
            )}
        </Mutation>
    )
}

const MilestonesForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
    salvationRowTitle = 'I got saved on:',
    salvationPlaceholder = 'Salvation Date',
    baptismRowTitle = 'I got baptized on:',
    baptismPlaceholder = 'Baptism Date',
}) => (
        <FlexedView>
            <BackgroundView>
                <PaddedView>
                    <DateSelect
                        title={salvationRowTitle}
                        value={has(values, 'salvationDate')
                            ? moment
                                .utc(get(values, 'salvationDate'))
                                .format('MMM DD, YYYY')
                            : salvationPlaceholder}
                        onChange={({ mutate, date }) => {
                            setSubmitting(true)

                            setFieldValue('salvationDate', date)
                            try {
                                const salvation = moment.utc(date).format()
                                mutate({ variables: { salvation } })
                            } catch (e) {
                                isSubmitting(false)
                            }
                        }}
                        onSuccess={() => setSubmitting(false)}
                        onError={(e) => {
                            setSubmitting(false)
                            // TODO : error handling
                        }}
                        mutation={UPDATE_SALVATION}
                    />

                    <DateSelect
                        title={baptismRowTitle}
                        value={has(values, 'baptismDate')
                            ? moment
                                .utc(get(values, 'baptismDate'))
                                .format('MMM DD, YYYY')
                            : baptismPlaceholder}
                        onChange={({ mutate, date }) => {
                            setSubmitting(true)

                            setFieldValue('baptismDate', date)
                            try {
                                const baptism = moment.utc(date).format()
                                mutate({ variables: { baptism } })
                            } catch (e) {
                                isSubmitting(false)
                            }
                        }}
                        onSuccess={() => setSubmitting(false)}
                        onError={(e) => {
                            setSubmitting(false)
                            // TODO : error handling
                        }}
                        mutation={UPDATE_BAPTISM} />

                </PaddedView>
            </BackgroundView>
            {isSubmitting && <ActivityIndicatorOverlay />}
        </FlexedView>
    )

const FormikForm = ({
    onSubmit,
    initialValues,
    isInitialValid,
    salvationRowTitle,
    baptismRowTitle
}) => {
    const Form = withFormik({
        mapPropsToValues: () => initialValues,
        onSubmit,
        initialValues,
        isInitialValid,
        salvationRowTitle,
        baptismRowTitle
    })(MilestonesForm)

    return <Form />
}

export default FormikForm