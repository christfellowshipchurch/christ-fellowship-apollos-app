import React from 'react'
import { Text, SafeAreaView, View, ScrollView } from 'react-native'
import { storiesOf } from '@apollosproject/ui-storybook'
import { styled, H4 } from '@apollosproject/ui-kit'

import {
    TextInput,
    Radio, RadioButton,
    Switch,
    Picker, PickerItem,
    DateInput
} from '../inputs'

const PaddedView = styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit * 4,
    paddingHorizontal: theme.sizing.baseUnit
}))(View)

const PaddedH4 = styled(({ theme }) => ({
    paddingTop: theme.sizing.baseUnit,
}))(H4)

storiesOf('Christ Fellowship UI Kit', module).add('Text Inputs', () => (
    <SafeAreaView>
        <PaddedView>
            <ScrollView>
                <PaddedH4>Text Input</PaddedH4>
                <TextInput
                    label={'Default'}
                    type={'text'}
                />

                <TextInput
                    label={'Error'}
                    type={'text'}
                    error='Some error'
                    errorIndicator
                />

                <TextInput
                    label={'Success'}
                    type={'text'}
                    errorIndicator
                />

                <TextInput
                    label={'Disabled'}
                    type={'text'}
                    disabled
                />
            </ScrollView>
        </PaddedView>
    </SafeAreaView>
))

storiesOf('Christ Fellowship UI Kit', module).add('Radio Inputs', () => (
    <SafeAreaView>
        <PaddedView>
            <ScrollView><PaddedH4>Radio Input</PaddedH4>
                <Radio>
                    <RadioButton label="option 1" value="one" />
                    <RadioButton label="option 2" value="two" />
                </Radio>
            </ScrollView>
        </PaddedView>
    </SafeAreaView>
))

storiesOf('Christ Fellowship UI Kit', module).add('Switch Inputs', () => (
    <SafeAreaView>
        <PaddedView>
            <ScrollView>
                <PaddedH4>Switch Input</PaddedH4>
                <Switch value={true} label="Active" />
                <Switch value={false} label="Unactive" />
            </ScrollView>
        </PaddedView>
    </SafeAreaView>
))

storiesOf('Christ Fellowship UI Kit', module).add('Picker Inputs', () => (
    <SafeAreaView>
        <PaddedView>
            <ScrollView>
                <PaddedH4>Picker Input</PaddedH4>
                <Picker label="One">
                    <PickerItem label="One" value="one" />
                    <PickerItem label="Two" value="two" />
                </Picker>
            </ScrollView>
        </PaddedView>
    </SafeAreaView>
))

storiesOf('Christ Fellowship UI Kit', module).add('Date Inputs', () => (
    <SafeAreaView>
        <PaddedView>
            <ScrollView>
                <PaddedH4>Date Input</PaddedH4>
                <DateInput />
            </ScrollView>
        </PaddedView>
    </SafeAreaView>
))