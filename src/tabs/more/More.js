import React, { useState, useEffect } from 'react';
import { Animated, Linking, View } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { get } from 'lodash';
import SafeAreaView from 'react-native-safe-area-view';
import PropTypes from 'prop-types';

import { FeedView, styled } from '@apollosproject/ui-kit';

import { TableView, Cell } from '../../ui/TableView';
import StatusBar from '../../ui/StatusBar';
import ThemeMixin from '../../ui/DynamicThemeMixin';

import {
  HEADER_OFFSET,
  navigationOptions,
  BackgroundView,
  NavigationBackground,
} from '../navigation';

const HeaderSpacer = styled(({ theme }) => ({
  height: HEADER_OFFSET,
}))(View);

const GET_LINKS = gql`
  query moreLinks {
    moreLinks {
      name
      links {
        name
        openInApp
        uri
        icon
      }
    }
  }
`;

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

const More = ({ navigation }) => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const setNavigationParam = (params) => {
    navigation.setParams(params);
  };
  const openLink = ({ uri, openInApp, title }) => {
    if (openInApp) {
      navigation.navigate('InlineWebView', {
        title,
        uri,
      });
    } else {
      Linking.canOpenURL(uri).then((supported) => {
        if (supported) {
          Linking.openURL(uri);
        } else {
          console.log(`Don't know how to open URI: ${uri}`);
        }
      });
    }
  };
  const renderItem = ({ item: { name, ...props } = {} }) => (
    <TableWithLinks key={name} name={name} {...props} onPress={openLink} />
  );

  useEffect(() => setNavigationParam({ scrollY }), []);

  return (
    <ThemeMixin>
      <BackgroundView>
        <SafeAreaView forceInset={{ bottom: 'never' }}>
          <StatusBar />
          <Query query={GET_LINKS} fetchPolicy="cache-and-network">
            {({ loading, error, data, refetch }) => (
              <FeedView
                content={get(data, 'moreLinks', [])}
                isLoading={loading}
                error={error}
                refetch={refetch}
                renderItem={renderItem}
                ListHeaderComponent={<HeaderSpacer />}
                scrollEventThrottle={16}
                onScroll={Animated.event([
                  {
                    nativeEvent: {
                      contentOffset: { y: scrollY },
                    },
                  },
                ])}
              />
            )}
          </Query>
        </SafeAreaView>
      </BackgroundView>
    </ThemeMixin>
  );
};

More.navigationOptions = ({ navigation, theme }) => ({
  ...navigationOptions,
  headerTitleStyle: {
    ...navigationOptions.headerTitleStyle,
    color: theme === 'dark' ? 'white' : 'black',
  },
  headerBackground: (
    <NavigationBackground
      scrollY={get(navigation, 'state.params.scrollY', new Animated.Value(0))}
    />
  ),
  title: 'More',
});

More.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

More.defaultProps = {};

export default More;
