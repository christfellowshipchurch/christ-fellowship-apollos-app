import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ThemeMixin, ErrorCard } from '@apollosproject/ui-kit';

import NavigationHeader from '../content-single/NavigationHeader';

import GET_GROUP from './getGroup';

class GroupSingle extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  static navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
  };

  render() {
    return (
      <Query
        query={GET_GROUP}
        variables={{ itemId: this.props.navigation.getParam('itemId', []) }}
        fetchPolicy="cache-and-network"
      >
        {({ data, error, loading }) => {
          if (error) return <ErrorCard error={error} />;

          const content = get(data, 'node', {});
          const { theme = {} } = content;
          return (
            <ThemeMixin theme={theme}>
              {this.renderContent({ content, loading, error })}
            </ThemeMixin>
          );
        }}
      </Query>
    );
  }
}

export default GroupSingle;
