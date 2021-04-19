import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeMixin, ErrorCard } from '@apollosproject/ui-kit';
import NavigationHeader from 'ui/NavigationHeader';

import Group from './Group';
import VolunteerGroup from './VolunteerGroup';

import GET_GROUP from './getGroup';

const renderContent = ({ itemId, content, loading }) => {
  let { __typename } = content;
  if (!__typename && itemId) {
    [__typename] = itemId.split(':');
  }

  switch (__typename) {
    case 'VolunteerGroup':
      return <VolunteerGroup id={itemId} content={content} loading={loading} />;
    case 'Group':
    default:
      return <Group id={itemId} content={content} loading={loading} />;
  }
};

const GroupSingle = (props) => {
  const itemId = props.route?.params?.itemId;
  const { data, loading, error } = useQuery(GET_GROUP, {
    variables: { itemId },
    skip: isEmpty(itemId),
    fetchPolicy: 'cache-and-network',
  });

  if (error && !data && !loading)
    return (
      <SafeAreaView>
        <NavigationHeader />
        <ErrorCard error={error} />
      </SafeAreaView>
    );

  const content = get(data, 'node', {});
  const { theme = {} } = content;

  return (
    <ThemeMixin theme={theme}>
      <NavigationHeader />
      <TrackEventWhenLoaded
        loaded={!!(!loading && content.title)}
        eventName={'View Group'}
        properties={{
          title: content.title,
          itemId,
        }}
      />
      {renderContent({ itemId, content, loading })}
    </ThemeMixin>
  );
};

GroupSingle.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
    members: PropTypes.shape({}),
    avatars: PropTypes.arrayOf(PropTypes.string),
    groupType: PropTypes.string,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      itemId: PropTypes.string,
    }),
  }),
};

export default GroupSingle;
