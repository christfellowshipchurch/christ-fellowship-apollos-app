import React from 'react';
import { ScrollView } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { SafeAreaView } from 'react-navigation';
import ReactNativeSideMenu from 'react-native-side-menu';

import { styled, ActivityIndicator } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

import { TableView, Cell } from '../ui/TableView';
import ThemeMixin from '../ui/DynamicThemeMixin';
import Logout from './Logout';
import { useSideMenu } from './index';

const GET_MORE_LINKS = gql`
  query getMoreLinks {
    moreLinks {
      name
      links {
        name
        uri
        icon
        openInApp
      }
    }
  }
`;

const BackgroundView = styled(({ theme }) => ({
    backgroundColor: theme.colors.screen,
    flex: 1,
}))(SafeAreaView);

const TableWithLinks = ({ name, links = [], onPress }) => (
    <TableView title={name} padded>
        {links.map(({ name: linkName, icon, openInApp, uri }) => (
            <Cell
                key={linkName}
                icon={icon}
                title={linkName}
                onPress={() => onPress(uri)}
            />
        ))}
    </TableView>
);

const Menu = ({ onPress }) => {
    const { loading, error, data } = useQuery(GET_MORE_LINKS, {
        fetchPolicy: 'cache-and-network',
    });

    if (loading && !data)
        return (
            <BackgroundView>
                <ScrollView>
                    <ActivityIndicator />
                    <Logout />
                </ScrollView>
            </BackgroundView>
        );

    return (
        <RockAuthedWebBrowser>
            {(openUrl) => (
                <ThemeMixin>
                    <BackgroundView>
                        <ScrollView>
                            {get(data, 'moreLinks', []).map(({ name, ...props }, i) => (
                                <TableWithLinks
                                    key={name}
                                    name={name}
                                    {...props}
                                    onPress={(uri) => openUrl(uri) && onPress()}
                                />
                            ))}

                            <Logout />
                        </ScrollView>
                    </BackgroundView>
                </ThemeMixin>
            )}
        </RockAuthedWebBrowser>
    );
};

const SideMenu = ({ children, navigation }) => {
    const { sideMenuIsOpen, setSideMenuIsOpen, closeSideMenu } = useSideMenu();

    return (
        <ReactNativeSideMenu
            menu={<Menu navigation={navigation} onPress={closeSideMenu} />}
            isOpen={sideMenuIsOpen}
            onChange={(inOpen) => setSideMenuIsOpen(inOpen)}
            menuPosition="right"
            disableGestures
        >
            {children}
        </ReactNativeSideMenu>
    );
};

SideMenu.propTypes = {};

SideMenu.defaultProps = {};

export default SideMenu;
