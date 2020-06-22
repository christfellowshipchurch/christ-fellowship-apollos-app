import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';
import { PickerItem as CorePickerItem, styled } from '@apollosproject/ui-kit';

import PickerList from '@apollosproject/ui-kit/src/inputs/Picker/PickerList';
import DynamicThemeMixin from '../DynamicThemeMixin';
import DropdownWrapper from './DropdownWrapper';

const pickerColorValue = new DynamicValue('black', 'white');
const pickerBackgroundColorValue = new DynamicValue('white', 'black');

export const PickerItem = styled(({ theme }) => ({
    color: theme.colors.text.primary,
}))(CorePickerItem);

const StyledPicker = styled(({ backgroundColor }) => ({
    backgroundColor,
}))(PickerList);

const Picker = (props) => {
    const [focused, setFocused] = useState(false);
    const { value, style, ...pickerProps } = props;
    const backgroundColor = useDynamicValue(pickerBackgroundColorValue);

    return (
        <DropdownWrapper
            {...props}
            handleOnPress={() => setFocused(!focused)}
            focused={focused}
        >
            <StyledPicker
                {...pickerProps}
                value={value}
                focused={focused}
                onRequestClose={() => setFocused(false)}
                backgroundColor={backgroundColor}
            />
        </DropdownWrapper>
    );
};

Picker.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
};

Picker.defaultProps = {
    style: {},
};

export default Picker;
