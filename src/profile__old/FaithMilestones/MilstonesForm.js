import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import { withFormik } from 'formik'
import { has, get } from 'lodash'
import moment from 'moment'
import { FormCard } from 'ChristFellowship/src/ui/Cards'
import { DateInput } from 'ChristFellowship/src/ui/inputs'

import { UPDATE_SALVATION, UPDATE_BAPTISM } from './mutations'

const DateSelect = ({ label, value, onChange, onSuccess, onError, mutation }) => {
    const [showDateTimePicker, setShowDateTimePicker] = useState(false)
    const [mutate] = useMutation(mutation, { update: onSuccess })
    return (
        <DateInput
            label={label}
            icon='calendar-alt'
            date={moment.utc(value).toDate()}
            value={moment(value).format('MMM D, YYYY')}
            displayValue={value
                ? moment(value).format('MMM D, YYYY')
                : ''}
            isVisible={showDateTimePicker}
            onConfirm={(date) => {
                setShowDateTimePicker(false)
                onChange({ mutate, date })
            }}
        />
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
        <>
            <FormCard title={salvationRowTitle} isLoading={isSubmitting}>
                <DateSelect
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
                    label={salvationPlaceholder}
                />
            </FormCard>
            <FormCard title={baptismRowTitle} isLoading={isSubmitting}>
                <DateSelect
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
                    mutation={UPDATE_BAPTISM}
                    label={baptismPlaceholder} />
            </FormCard>
        </>
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