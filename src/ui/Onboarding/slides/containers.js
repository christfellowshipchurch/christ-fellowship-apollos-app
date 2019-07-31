import React from 'react'
import {
    KeyboardAvoidingView,
    StyleSheet,
    ScrollView
} from 'react-native'

import {
    PaddedView,
    Button
} from '@apollosproject/ui-kit'

import {
    FlexedSafeAreaView,
    FlexedFooter
} from './styles.js'

export const FormFields = ({ children }) => {
    return (
        <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior={'padding'}>
            <FlexedSafeAreaView>
                <ScrollView>
                    <PaddedView>
                        {children}
                    </PaddedView>
                </ScrollView>
            </FlexedSafeAreaView>
        </KeyboardAvoidingView>
    )
}

export const SubmitButton = ({ buttonProps }) => {
    return (
        <FlexedFooter>
            <PaddedView>
                <Button {...buttonProps} />
            </PaddedView>
        </FlexedFooter>
    )
}