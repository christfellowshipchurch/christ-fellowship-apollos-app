import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'

import DropdownWrapper from './DropdownWrapper'

const DateInput = (props) => {
    const [focused, setFocused] = useState(false)
    const {
        value,
        onConfirm,
        label,
        ...dateInputProps
    } = props

    const date = moment.utc(value).toDate()

    return (
        <DropdownWrapper
            {...props}
            label={label}
            handleOnPress={() => setFocused(!focused)}
            focused={focused} >
            <DateTimePicker
                {...dateInputProps}
                // date={date}
                isVisible={focused}
                onConfirm={(date) => {
                    setFocused(false)
                    onConfirm(date)
                }}
                onCancel={() => setFocused(false)}
            />
        </DropdownWrapper >
    )
}

DateInput.propTypes = {
    value: PropTypes.string,
    onConfirm: PropTypes.func
}

DateInput.defaultProps = {
    value: moment().toString(),
    icon: 'calendar-alt',
    label: moment().format('MMM DD, YYYY')
}

export default DateInput