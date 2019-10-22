import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo'

import { ButtonLink, UIText } from '@apollosproject/ui-kit'

import { REQUEST_EMAIL_PIN } from '../mutations'

const PasswordReset = ({
    children,
    email,
    update,
    onPress,
    requestedPrompt,
    requestedDelay,
}) => {
    const [requestPin] = useMutation(REQUEST_EMAIL_PIN)
    const [requested, setRequested] = useState(false)

    const onUpdate = () => setTimeout(() => {
        update()
        setRequested(false)
    }, requestedDelay)

    return requested
        ? (
            <UIText>
                {requestedPrompt}
            </UIText>
        )
        : (
            <ButtonLink
                onPress={() => {
                    onPress()
                    setRequested(true)
                    requestPin({
                        variables: { email },
                        update: onUpdate
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
    requestedPrompt: PropTypes.string,
    requestedDelay: PropTypes.number,
}

PasswordReset.defaultProps = {
    update: () => true,
    onClick: () => true,
    requestedPrompt: "You should get an email with instructions on how to reset your password.",
    requestedDelay: 5000,
}

export default PasswordReset