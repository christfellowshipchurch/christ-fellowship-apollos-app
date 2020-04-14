import React from 'react';
import { ScrollView } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { SafeAreaView } from 'react-navigation';
import ReactNativeSideMenu from 'react-native-side-menu';

import { styled, ActivityIndicator } from '@apollosproject/ui-kit';

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
                onPress={() => onPress({ uri, openInApp, title: linkName })}
            />
        ))}
    </TableView>
);

const Menu = () => {
    const { loading, error, data } = useQuery(GET_MORE_LINKS, {
        fetchPolicy: 'cache-and-network',
    });

    if (loading)
        return (
            <BackgroundView>
                <ActivityIndicator />
            </BackgroundView>
        );

    const openLink = ({ uri, openInApp, title }) => {
        // if (openInApp) {
        //     navigation.navigate('InlineWebView', {
        //         title,
        //         uri,
        //     });
        // } else {
        //     Linking.canOpenURL(uri).then((supported) => {
        //         if (supported) {
        //             Linking.openURL(uri);
        //         } else {
        //             console.log(`Don't know how to open URI: ${uri}`);
        //         }
        //     });
        // }
    };

    return (
        <ThemeMixin>
            <BackgroundView>
                <ScrollView>
                    {get(data, 'moreLinks', []).map(({ name, ...props }, i) => (
                        <TableWithLinks
                            key={name}
                            name={name}
                            {...props}
                            onPress={openLink}
                        />
                    ))}
                    <Logout />
                </ScrollView>
            </BackgroundView>
        </ThemeMixin>
    );
};

const SideMenu = ({ children }) => {
    const { sideMenuIsOpen } = useSideMenu();

    return (
        <ReactNativeSideMenu
            menu={<Menu />}
            isOpen={sideMenuIsOpen}
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
