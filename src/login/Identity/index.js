import React from 'react'
import { useMutation } from 'react-apollo'
import { has, get, upperCase } from 'lodash'
import * as Yup from 'yup'

import { useForm } from 'ChristFellowship/src/hooks'
import { parseUsername } from 'ChristFellowship/src/utils/login'

import {
    Button,
    FlexedView,
    H6,
    styled
} from '@apollosproject/ui-kit'
import { TextInput, Switch } from 'ChristFellowship/src/ui/inputs'
import { Container } from '../containers.js'

import { IS_VALID_IDENTITY, REQUEST_PIN } from '../mutations'

const StyledFlexedView = styled(() => ({
    flexDirection: 'row',
    alignItems: 'center'
}))(FlexedView)

const StyledH6 = styled(({ theme }) => ({
    flex: 2,
    paddingHorizontal: theme.sizing.baseUnit,
}))(H6)

const validation = {
    identity: async (value) => {
        const schema = Yup.string()
        const isValid = await schema.isValid(value)

        if (isValid && value !== '') {
            const { email, phoneNumber } = await parseUsername(value)

            if (email || phoneNumber) return false
        }

        return 'Please enter a valid phone number or email'
    }
}

const IdentityForm = ({
    title,
    description,
    disclaimerText,
    buttonText,
    navigation,
}) => {
    const {
        values,
        errors,
        submitting,
        setValue,
        setSubmitting,
        resetForm,
    } = useForm({
        validation,
        defaultValues: {
            privacyPolicyAgreement: false
        }
    })
    const [validateIdentity] = useMutation(IS_VALID_IDENTITY)
    const [requestPin] = useMutation(REQUEST_PIN)

    const handleSubmit = async () => {
        setSubmitting(true)
        const identity = get(values, 'identity', '')
        const { email, phoneNumber } = await parseUsername(identity)

        if (email) {
            validateIdentity({
                variables: {
                    identity,
                },
                update: (cache, { data: { isValidIdentity: { success, isExistingIdentity } } }) => {
                    if (success) {
                        // navigate to Passcode validation
                        navigation.navigate(
                            'Passcode',
                            {
                                identity,
                                type: 'password',
                                isExistingIdentity,
                                success,
                            })
                    } else {
                        // show some error on the screen
                    }

                    resetForm()
                },
                onError: () => resetForm()
            })
        } else if (phoneNumber) {
            requestPin({
                variables: {
                    phoneNumber: identity,
                },
                update: (cache, { data: { requestSmsLoginPin: { success, isExistingIdentity } } }) => {
                    if (success) {
                        // navigate to Passcode validation
                        navigation.navigate(
                            'Passcode',
                            {
                                type: 'sms',
                                identity,
                                isExistingIdentity,
                                success
                            })
                    } else {
                        // show some error on the screen
                    }

                    resetForm()
                },
                onError: () => resetForm()
            })
        } else {
            resetForm()
            // error handling
        }
    }

    const disabled = !!get(errors, 'identity', true)
        || !get(values, 'privacyPolicyAgreement', false)
        || submitting

    return (
        <Container title={title} description={description}>
            <TextInput
                textContentType='telephoneNumber'
                label={'Mobile Number OR Email'}
                type="text"
                value={get(values, 'identity', '')}
                returnKeyType={'done'}
                error={get(errors, 'identity', '')}
                onChangeText={(text) => setValue('identity', text)}
                autoCapitalize='none'
                enablesReturnKeyAutomatically
                errorIndicator={has(values, 'identity') && values.identity !== ''}
                hideErrorText
                icon='user'
            />

            <StyledFlexedView>
                <Switch
                    label={disclaimerText}
                    value={get(values, 'privacyPolicyAgreement', false)}
                    onValueChange={() => setValue(
                        'privacyPolicyAgreement',
                        !get(values, 'privacyPolicyAgreement', false)
                    )}
                />
                <StyledH6>
                    {disclaimerText}
                </StyledH6>
            </StyledFlexedView>

            <Container.Footer>
                <Button
                    title={upperCase(buttonText)}
                    onPress={handleSubmit}
                    disabled={disabled}
                    loading={submitting}
                />
            </Container.Footer>
        </Container>
    )
}

IdentityForm.defaultProps = {
    title: 'Welcome Home!',
    description: [
        'Your new Christ Fellowship digital experience starts here, and your profile helps us customize it for you.',
        'Please enter either your phone or email address to get started.'
    ],
    disclaimerText: "I understand and agree to the following policies as laid out by Christ Fellowship Church",
    buttonText: 'Continue'
}

IdentityForm.navigationOptions = {
    header: null,
    gesturesEnabled: false,
    displayName: 'Identity'
}

export default IdentityForm
