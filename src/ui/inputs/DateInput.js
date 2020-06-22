import React, { useEffect } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { range } from 'lodash';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';

import { useForm } from '../../hooks';
import Picker, { PickerItem } from './Picker';

const pickerColorValue = new DynamicValue('black', 'white');

const formatDefaultYear = (year, min, max) => {
    if (year > max) return max.toString();
    if (year < min) return min.toString();

    return year.toString();
};

const DateInput = ({ value, icon, minYear, maxYear, onConfirm }) => {
    const mValue = moment(value);
    const pickerColor = useDynamicValue(pickerColorValue);
    const months = moment.months();
    const monthIndex = (m) =>
        months
            .indexOf(
                moment()
                    .month(m)
                    .format('MMMM')
            )
            .toString();
    const daysInMonth = (m) =>
        moment()
            .month(m)
            .daysInMonth();

    const { values, setValue } = useForm({
        defaultValues: {
            month: monthIndex(mValue.month()),
            day: mValue.date().toString(),
            year: formatDefaultYear(mValue.year(), minYear, maxYear),
        },
    });

    const maxDay = daysInMonth(values.month);
    const { month, day, year } = values;
    const displayMonth = moment()
        .month(month)
        .format('MMMM')
        .toString();

    // Check to make sure that we don't have
    // an invalid day for the given month
    if (values.day > daysInMonth(month)) {
        setValue('day', 1);
    }

    useEffect(
        () =>
            onConfirm(
                moment()
                    .year(year)
                    .month(month)
                    .date(day)
                    .toString()
            ),
        [values]
    );

    const yearRange = [minYear, maxYear].sort((a, b) => a > b);

    return (
        <View>
            <Picker
                label="Month"
                value={month.toString()}
                displayValue={displayMonth}
                onValueChange={(newMonth) => setValue('month', monthIndex(newMonth))}
                icon={icon}
            >
                {months.map((m) => (
                    <PickerItem
                        label={m}
                        value={monthIndex(m).toString()}
                        key={m}
                        color={pickerColor}
                    />
                ))}
            </Picker>
            <Picker
                label="Day"
                value={day}
                displayValue={day}
                onValueChange={(newDay) => setValue('day', newDay)}
                hideIcon
            >
                {range(0, maxDay + 1).map((d) => (
                    <PickerItem
                        label={d.toString()}
                        value={d.toString()}
                        key={`${month}${d}`}
                        color={pickerColor}
                    />
                ))}
            </Picker>
            <Picker
                label="Year"
                value={year}
                displayValue={year}
                onValueChange={(newYear) => setValue('year', newYear)}
                hideIcon
            >
                {range(yearRange[0], yearRange[1] + 1).map((y) => (
                    <PickerItem
                        label={y.toString()}
                        value={y.toString()}
                        key={`${month}${y}`}
                        color={pickerColor}
                    />
                ))}
            </Picker>
        </View>
    );
};

DateInput.propTypes = {
    value: PropTypes.string,
    onConfirm: PropTypes.func,
    icon: PropTypes.string,
    maxYear: PropTypes.number,
    minYear: PropTypes.number,
};

DateInput.defaultProps = {
    value: moment().toString(),
    onConfirm: (date) => null,
    icon: 'birthday-cake',
    maxYear: moment().year(),
    minYear: moment().year() - 100,
};

export default DateInput;
