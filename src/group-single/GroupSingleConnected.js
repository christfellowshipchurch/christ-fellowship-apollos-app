import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ThemeMixin, ErrorCard } from '@apollosproject/ui-kit';

import NavigationHeader from '../content-single/NavigationHeader';

import GET_GROUP from './getGroup';
import GroupSingle from './GroupSingle';

class GroupSingleConnected extends PureComponent {
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
              <GroupSingle
                allowMessages={get(content, 'allowMessages')}
                avatars={get(content, 'avatars', [])}
                content={content}
                contentId={get(content, 'id')}
                coverImageSources={get(content, 'coverImage.sources', [])}
                startTime={get(content, 'dateTime.start')}
                groupType={get(content, 'groupType')}
                loading={loading}
                members={get(content, 'members', [])}
                parentVideoCall={get(content, 'parentVideoCall', {})}
                phoneNumbers={get(content, 'phoneNumbers', [])}
                resources={get(content, 'groupResources', [])}
                summary={get(content, 'summary')}
                title={get(content, 'title')}
              />
            </ThemeMixin>
          );
        }}
      </Query>
    );
  }
}

export default GroupSingleConnected;
