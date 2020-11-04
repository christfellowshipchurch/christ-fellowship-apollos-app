import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';

import { ThemeMixin, ErrorCard } from '@apollosproject/ui-kit';

import NavigationHeader from 'ui/NavigationHeader';
import Group from './Group';
import VolunteerGroup from './VolunteerGroup';

import GET_GROUP from './getGroup';

class GroupSingle extends PureComponent {
  static propTypes = {
    content: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      summary: PropTypes.string,
      members: PropTypes.shape({}),
      avatars: PropTypes.arrayOf(PropTypes.string),
      groupType: PropTypes.string,
    }),
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  get itemId() {
    return this.props.navigation.getParam('itemId', []);
  }

  get queryVariables() {
    return { itemId: this.itemId };
  }

  static navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
  };

  renderContent = ({ content, loading }) => {
    let { __typename } = content;
    if (!__typename && this.itemId) {
      [__typename] = this.itemId.split(':');
    }

    switch (__typename) {
      case 'VolunteerGroup':
        return (
          <VolunteerGroup
            id={this.itemId}
            content={content}
            loading={loading}
            navigation={this.props.navigation}
          />
        );
      case 'Group':
      default:
        return (
          <Group
            id={this.itemId}
            content={content}
            loading={loading}
            navigation={this.props.navigation}
          />
        );
    }
  };

  renderWithData = ({ data, error, loading }) => {
    if (error) return <ErrorCard error={error} />;

    const content = get(data, 'node', {});
    const { theme = {} } = content;

    return (
      <ThemeMixin theme={theme}>
        <TrackEventWhenLoaded
          loaded={!!(!loading && content.title)}
          eventName={'View Group'}
          properties={{
            title: content.title,
            itemId: this.itemId,
          }}
        />
        {this.renderContent({ content, loading, error })}
      </ThemeMixin>
    );
  };

  render() {
    return (
      <Query
        query={GET_GROUP}
        variables={this.queryVariables}
        fetchPolicy="cache-and-network"
      >
        {this.renderWithData}
      </Query>
    );
  }
}

export default GroupSingle;
