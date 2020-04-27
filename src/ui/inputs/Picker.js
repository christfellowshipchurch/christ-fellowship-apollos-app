import React, { useState } from 'react';
import { CorePickerItem } from '@apollosproject/ui-kit';

import PickerList from '@apollosproject/ui-kit/src/inputs/Picker/PickerList';
import DropdownWrapper from './DropdownWrapper';

export const PickerItem = (props) => <CorePickerItem {...props} />;

const Picker = (props) => {
    const [focused, setFocused] = useState(false);
    const { value, ...pickerProps } = props;

    return (
        <DropdownWrapper
            {...props}
            handleOnPress={() => setFocused(!focused)}
            focused={focused}
        >
            <PickerList
                {...pickerProps}
                value={value}
                focused={focused}
                onRequestClose={() => setFocused(false)}
            />
        </DropdownWrapper>
    );
};

export default Picker;
