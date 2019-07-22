import React from 'react';
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import {
    PaddedView,
    Button,
    ButtonLink
} from '@apollosproject/ui-kit';

import {
    FlexedSafeAreaView,
    TitleText,
    PromptText,
    BrandIcon,
    CenterAlignedLink
} from '../styles';

const EnableNotificationsForm =
    ({
        buttonText,
        handleSubmit,
        disabled,
        titleText,
        promptText,
        skipButtonText,
        handleSkip
    }) => (
            <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior={'padding'}>
                <FlexedSafeAreaView>
                    <ScrollView>
                        <PaddedView>
                            <BrandIcon />
                            <TitleText>{titleText}</TitleText>
                            <PromptText padded>
                                {promptText}
                            </PromptText>
                        </PaddedView>
                    </ScrollView>

                    <PaddedView>
                        <Button
                            title={buttonText}
                            onPress={handleSubmit}
                        />
                    </PaddedView>
                    <PaddedView>
                        <CenterAlignedLink>
                            <ButtonLink
                                onPress={handleSkip}
                            >
                                {skipButtonText}
                            </ButtonLink>
                        </CenterAlignedLink>
                    </PaddedView>
                </FlexedSafeAreaView>
            </KeyboardAvoidingView>
        )

EnableNotificationsForm.propTypes = {};

EnableNotificationsForm.defaultProps = {
    buttonText: 'Enable Push Notifications',
    skipButtonText: 'Skip for now',
    titleText: "Let's stay in touch",
    promptText: "Turning on Push Notifications allow for to blah blah blah. So let's go ahead and doopidy dee doo",
    requiredFieldText: "*indicates a required field"
};

EnableNotificationsForm.displayName = 'ProfileInformationForm';

export default EnableNotificationsForm;
