import React from './node_modules/react'
import {
    ButtonLink
} from './node_modules/@apollosproject/ui-kit'

import {
    FormFields,
    SubmitButton
} from '../../containers.js/index.js'

import {
    TitleText,
    PromptText,
    BrandIcon,
    CenterAlignedLink,
} from '../../styles'

const EnableNotificationsForm =
    ({
        buttonText,
        handleSubmit,
        titleText,
        promptText,
        skipButtonText,
        handleSkip,
    }) => (
            <React.Fragment>
                <FormFields>
                    <BrandIcon />
                    <TitleText>{titleText}</TitleText>
                    <PromptText padded>
                        {promptText}
                    </PromptText>
                </FormFields>
                <SubmitButton
                    buttonProps={{
                        title: buttonText,
                        onPress: handleSubmit
                    }}
                />
                <CenterAlignedLink>
                    <ButtonLink
                        onPress={handleSkip}
                    >
                        {skipButtonText}
                    </ButtonLink>
                </CenterAlignedLink>
            </React.Fragment>
        )

EnableNotificationsForm.defaultProps = {
    buttonText: 'Enable Push Notifications',
    skipButtonText: 'Skip for now',
    titleText: "Let's stay in touch",
    promptText: "Turning on Push Notifications allow for to blah blah blah. So let's go ahead and doopidy dee doo",
    requiredFieldText: "*indicates a required field"
}

export default EnableNotificationsForm
