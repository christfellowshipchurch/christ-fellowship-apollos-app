import React from 'react';
import { useMutation } from 'react-apollo';
import { SafeAreaView, ScrollView } from 'react-navigation';
import { getVersion } from 'react-native-device-info';

import {
    styled,
    BackgroundView,
    FlexedView,
    BodyText,
} from '@apollosproject/ui-kit';
import { LOGOUT } from '@apollosproject/ui-auth';

import { TableView, Cell } from 'ChristFellowship/src/ui/TableView';
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser';

import PersonalInformation from './PersonalInformation';

const VersionText = styled(({ theme }) => ({
    fontSize: 14,
    marginBottom: theme.sizing.baseUnit * 2.5,
}))(BodyText);

const Settings = ({ navigation }) => {
    const [handleLogout] = useMutation(LOGOUT);

    return (
        <BackgroundView>
            <SafeAreaView>
                <ScrollView style={{ height: '100%' }}>
                    <PersonalInformation />

                    <WebBrowserConsumer>
                        {(openUrl) => (
                            <TableView title="App Information">
                                <Cell
                                    icon="list"
                                    title="Terms & Conditions"
                                    onPress={() =>
                                        openUrl('https://beta.christfellowship.church')
                                    }
                                />
                                <Cell
                                    icon="lock"
                                    title="Privacy Policy"
                                    onPress={() =>
                                        openUrl('https://beta.christfellowship.church')
                                    }
                                />
                                <Cell
                                    icon="envelope"
                                    title="Send Feedback"
                                    onPress={() =>
                                        openUrl('https://beta.christfellowship.church')
                                    }
                                />
                            </TableView>
                        )}
                    </WebBrowserConsumer>

                    <FlexedView
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                        <VersionText>{`Version ${getVersion()}`}</VersionText>
                    </FlexedView>

                    <TableView>
                        <Cell
                            icon="share-square"
                            title="Log Out"
                            onPress={() => handleLogout()}
                        />
                    </TableView>
                </ScrollView>
            </SafeAreaView>
        </BackgroundView>
    );
};

export default Settings;
