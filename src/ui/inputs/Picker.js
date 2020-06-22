import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';
import {
    Picker as CorePicker,
    PickerItem as CorePickerItem,
    styled,
} from '@apollosproject/ui-kit';

import { InputIcon } from './styles';

const pickerBackgroundColorValue = new DynamicValue('white', 'black');

export const PickerItem = styled(({ theme }) => ({
    color: theme.colors.text.primary,
    ...Platform.select({
        android: {
            fontFamily: theme.typography.sans.bold.default,
        },
    }),
}))(CorePickerItem);

const Row = styled(({ theme }) => ({
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
}))(View);

const StyledPicker = styled(({ theme }) => ({
    paddingTop: theme.sizing.baseUnit * 0.5,
    ...Platform.select({
        android: {
            fontFamily: theme.typography.sans.bold.default,
        },
    }),
}))(CorePicker);

const Picker = ({ value, style, icon, hideIcon, ...pickerProps }) => {
    const [focused, setFocused] = useState(false);
    const backgroundColor = useDynamicValue(pickerBackgroundColorValue);

    return (
        <Row>
            <InputIcon focused={focused} icon={icon} hideIcon={hideIcon} />
            <StyledPicker
                {...pickerProps}
                value={value}
                focused={focused}
                onRequestClose={() => setFocused(false)}
                backgroundColor={backgroundColor}
                wrapperStyle={{ flex: 1 }}
            />
        </Row>
    );
};

Picker.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    icon: PropTypes.string,
    hideIcon: PropTypes.bool,
};

Picker.defaultProps = {
    style: {},
    hideIcon: false,
    icon: 'text',
};

export default Picker;
