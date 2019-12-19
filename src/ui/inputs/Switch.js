import React from 'react'
import PropTypes from 'prop-types'
import { compose, withProps, pure } from 'recompose'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    withTheme,
    Switch as CoreSwitch
} from '@apollosproject/ui-kit'

const enhance = compose(
    withTheme(),
    pure,
    withProps(({ ...props }) => ({
        ...props,
    }))
)

const StyledIcon = withTheme(({ theme, error, disabled, color, icon }) => ({
    icon: ['fal', icon],
    size: 28,
    color,
    marginHorizontal: theme.sizing.baseUnit * 0.5
}))(FontAwesomeIcon)

const Switch = enhance(({
    icon,
    hideIcon,
    theme,
    disabled,
    ...props
}) => {
    const color = disabled
        ? theme.colors.lightSecondary
        : theme.colors.darkSecondary

    return (
        <CoreSwitch
            prefix={icon && <StyledIcon
                icon={icon}
                color={hideIcon ? 'transparent' : color} />}
            {...props}
        />
    )
})

Switch.propTypes = {
    icon: PropTypes.string,
    disabled: PropTypes.bool,
}

Switch.defaultProps = {
    icon: null,
    disabled: false,
}

export default Switch