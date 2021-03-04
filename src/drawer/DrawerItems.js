import React from 'react';
import { ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styled, ActivityIndicator } from '@apollosproject/ui-kit';
import { useLinkRouter } from '../hooks';

import { TableView, Cell } from '../ui/TableView';
import ThemeMixin from '../ui/DynamicThemeMixin';
import Logout from './Logout';

const GET_MORE_LINKS = gql`
  query getMoreLinks {
    moreLinks {
      name
      links {
        name
        uri
        icon
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
    {links.map(({ name: linkName, icon, uri }) => (
      <Cell
        key={linkName}
        icon={icon}
        title={linkName}
        onPress={() => onPress(uri)}
      />
    ))}
  </TableView>
);

const DrawerItems = ({ onPress, navigation }) => {
  const { routeLink } = useLinkRouter();
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
    <ThemeMixin>
      <BackgroundView>
        <ScrollView>
          {get(data, 'moreLinks', []).map(({ name, ...props }, i) => (
            <TableWithLinks
              key={name}
              name={name}
              {...props}
              onPress={(uri) => routeLink(uri) && onPress()}
            />
          ))}

          <Logout onLogout={() => navigation.closeDrawer()} />
        </ScrollView>
      </BackgroundView>
    </ThemeMixin>
  );
};

export default DrawerItems;
