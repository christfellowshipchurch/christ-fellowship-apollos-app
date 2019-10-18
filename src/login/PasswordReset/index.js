import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo'

import { ButtonLink } from '@apollosproject/ui-kit'

import { REQUEST_EMAIL_PIN } from '../mutations'

const PasswordReset = ({
    children,
    email,
    update,
    onPress
}) => {
    const [requestPin] = useMutation(REQUEST_EMAIL_PIN)
    const [disabled, setDisabled] = useState(false)

    return (
        <ButtonLink
            disabled={disabled}
            onPress={() => {
                onPress()
                setDisabled(true)
                requestPin({
                    variables: { email },
                    update: () => {
                        setDisabled(false)
                        update()
                    }
                })
            }}
        >
            {children}
        </ButtonLink>
    )
}

PasswordReset.propTypes = {
    email: PropTypes.string.isRequired,
    update: PropTypes.func,
    onClick: PropTypes.func,
}

PasswordReset.defaultProps = {
    update: () => true,
    onClick: () => true,
}

export default PasswordReset