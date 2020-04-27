import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useDarkMode } from 'react-native-dark-mode';

import DropdownWrapper from './DropdownWrapper';

const DateInput = (props) => {
    const [focused, setFocused] = useState(false);
    const { value, onConfirm, label, displayValue, ...dateInputProps } = props;
    const isDarkMode = useDarkMode();

    return (
        <DropdownWrapper
            {...props}
            displayValue={displayValue}
            label={label}
            handleOnPress={() => setFocused(!focused)}
            focused={focused}
        >
            <DateTimePicker
                {...dateInputProps}
                date={moment(displayValue).toDate()}
                isVisible={focused}
                onConfirm={(date) => {
                    setFocused(false);
                    onConfirm(date);
                }}
                isDarkModeEnabled={isDarkMode}
                onCancel={() => setFocused(false)}
            />
        </DropdownWrapper>
    );
};

DateInput.propTypes = {
    value: PropTypes.string,
    onConfirm: PropTypes.func,
    label: PropTypes.string,
    displayValue: PropTypes.string,
};

DateInput.defaultProps = {
    value: moment().toString(),
    icon: 'birthday-cake',
    label: '',
    initialDate: moment(),
};

export default DateInput;
