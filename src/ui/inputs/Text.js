import React, { useState } from 'react'
import { compose, withProps, pure } from 'recompose'

import { TextInput as CoreTextInput, withTheme } from '@apollosproject/ui-kit'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const enhance = compose(
    withTheme(),
    pure,
    withProps(({ ...props }) => ({
        ...props,
    }))
)

const Indicator = withTheme(({ theme, error, disabled }) => ({
    icon: ['fal', disabled
        ? 'ban'
        : (error ? 'times-circle' : 'check-circle')],
    size: 28,
    color: disabled
        ? theme.colors.lightSecondary
        : (error ? theme.colors.alert : theme.colors.success)
}))(FontAwesomeIcon)

const StyledIcon = withTheme(({ theme, error, disabled, color, icon }) => ({
    icon: ['fal', icon],
    size: 28,
    color,
    marginHorizontal: theme.sizing.baseUnit * 0.5
}))(FontAwesomeIcon)

const TextInput = enhance((props) => {
    const {
        icon,
        theme,
        errorIndicator,
        hideErrorText,
        error,
        disabled,
        hideIcon
    } = props
    const [focused, setFocused] = useState(false)
    const color = disabled
        ? theme.colors.lightSecondary
        : (focused
            ? theme.colors.primary
            : theme.colors.darkSecondary)

    return (
        <CoreTextInput
            {...props}
            onFocus={() => setFocused(true)}
            onEndEditing={() => setFocused(false)}
            error={hideErrorText ? '' : error}
            prefix={
                <StyledIcon
                    icon={icon}
                    color={hideIcon ? 'transparent' : color} />}
            suffix={(errorIndicator || disabled) && <Indicator error={Boolean(error)} disabled={disabled} />} />
    )
})

TextInput.defaultProps = {
    icon: 'text',
    errorIndicator: false,
    hideErrorText: false,
    disabled: false,
    hideIcon: false
}

export default TextInput