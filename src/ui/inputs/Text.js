import React, { useState } from 'react';
import { compose, withProps, pure } from 'recompose';

import {
    TextInput as CoreTextInput,
    withTheme,
    Icon,
} from '@apollosproject/ui-kit';
import { InputIcon } from './styles';

const enhance = compose(
    withTheme(),
    pure,
    withProps(({ ...props }) => ({
        ...props,
    }))
);

const Indicator = withTheme(({ theme, error, disabled }) => ({
    name: disabled
        ? 'circle-outline-x-mark'
        : error
            ? 'circle-outline-x-mark'
            : 'circle-outline-check-mark',
    size: 20,
    fill: disabled
        ? theme.colors.lightSecondary
        : error
            ? theme.colors.alert
            : theme.colors.success,
}))(Icon);

const TextInput = enhance((props) => {
    const {
        icon,
        theme,
        errorIndicator,
        hideErrorText,
        error,
        disabled,
        hideIcon,
    } = props;
    const [focused, setFocused] = useState(false);

    return (
        <CoreTextInput
            {...props}
            onFocus={() => setFocused(true)}
            onEndEditing={() => setFocused(false)}
            error={hideErrorText ? '' : error}
            prefix={
                <InputIcon
                    icon={icon}
                    disbled={disabled}
                    focused={focused}
                    hideIcon={hideIcon}
                />
            }
            suffix={
                (errorIndicator || disabled) && (
                    <Indicator error={Boolean(error)} disabled={disabled} />
                )
            }
        />
    );
});

TextInput.defaultProps = {
    icon: 'text',
    errorIndicator: false,
    hideErrorText: false,
    disabled: false,
    hideIcon: false,
};

export default TextInput;
