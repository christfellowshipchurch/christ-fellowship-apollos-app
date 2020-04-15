import React from 'react';
import { View } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { getVersion } from 'react-native-device-info';

import { BodyText, FlexedView, styled } from '@apollosproject/ui-kit';

import { LOGOUT } from '@apollosproject/ui-auth';
import NavigationService from '../NavigationService';

import { TableView, Cell } from '../ui/TableView';
import { useSideMenu } from '.';

const VersionText = styled(({ theme }) => ({
    fontSize: 14,
    marginTop: theme.sizing.baseUnit * 0.5,
}))(BodyText);

const Logout = () => {
    const { closeSideMenu } = useSideMenu();
    const [handleLogout] = useMutation(LOGOUT);

    return (
        <View>
            <FlexedView style={{ justifyContent: 'center', alignItems: 'center' }}>
                <VersionText>{`Version ${getVersion()}`}</VersionText>
            </FlexedView>
            <TableView>
                <Cell
                    icon="share-square"
                    title="Log Out"
                    onPress={async () => {
                        await handleLogout();
                        // This resets the navigation stack, and the navigates to the first auth screen.
                        // This ensures that user isn't navigated to a subscreen of Auth, like the pin entry screen.
                        await NavigationService.resetToAuth();
                        closeSideMenu();
                    }}
                />
            </TableView>
        </View>
    );
};

Logout.propTypes = {};

Logout.defaultProps = {};

export default Logout;
