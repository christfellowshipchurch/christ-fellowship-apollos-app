import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo'

import { ButtonLink } from '@apollosproject/ui-kit'

import { REQUEST_PIN } from '../mutations'

const ResendSMS = ({
    children,
    phoneNumber
}) => {
    const [requestPin] = useMutation(REQUEST_PIN)
    const [disabled, setDisabled] = useState(false)

    return (
        <ButtonLink
            disabled={disabled}
            onPress={() => {
                setDisabled(true)
                requestPin({
                    variables: { phoneNumber },
                    update: () => setDisabled(false)
                })
            }}
        >
            {children}
        </ButtonLink>
    )
}

ResendSMS.propTypes = {
    phoneNumber: PropTypes.string.isRequired
}

ResendSMS.defaultProps = {
}

export default ResendSMS