import React from 'react'
import { SafeAreaView, ScrollView } from 'react-navigation'

import {
    BackgroundView
} from '@apollosproject/ui-kit'

import {
    TableView, Cell
} from 'ChristFellowship/src/ui/TableView'
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser'

import PersonalInformation from './PersonalInformation'

const Settings = ({
    navigation
}) => {
    return <BackgroundView>
        <SafeAreaView>
            <ScrollView style={{ height: '100%' }}>
                <PersonalInformation />

                <WebBrowserConsumer>
                    {(openUrl) => (
                        <TableView title="App Information">
                            <Cell
                                icon='list'
                                title='Terms & Conditions'
                                onPress={() => openUrl('https://beta.christfellowship.church')}
                            />
                            <Cell
                                icon='lock'
                                title='Privacy Policy'
                                onPress={() => openUrl('https://beta.christfellowship.church')}
                            />
                            <Cell
                                icon='envelope'
                                title='Send Feedback'
                                onPress={() => openUrl('https://beta.christfellowship.church')}
                            />
                        </TableView>
                    )}
                </WebBrowserConsumer>
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
}

export default Settings