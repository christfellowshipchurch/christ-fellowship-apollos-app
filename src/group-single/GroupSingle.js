import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';

import { ThemeMixin, ErrorCard } from '@apollosproject/ui-kit';

import Group from './Group';
import VolunteerGroup from './VolunteerGroup';

import GET_GROUP from './getGroup';

const GroupSingle = (props) => {
  const itemId = props.route?.params?.itemId;
  const { data, loading, error } = useQuery(GET_GROUP, {
    variables: { itemId },
    skip: isEmpty(itemId),
    fetchPolicy: 'cache-and-network',
  });

  if (error) return <ErrorCard error={error} />;

  const content = get(data, 'node', {});
  const { theme = {} } = content;
  const renderContent = () => {
    let { __typename } = content;
    if (!__typename && itemId) {
      [__typename] = itemId.split(':');
    }

    switch (__typename) {
      case 'VolunteerGroup':
        return (
          <VolunteerGroup id={itemId} content={content} loading={loading} />
        );
      case 'Group':
      default:
        return <Group id={itemId} content={content} loading={loading} />;
    }
  };

  return (
    <ThemeMixin theme={theme}>
      <TrackEventWhenLoaded
        loaded={!!(!loading && content.title)}
        eventName={'View Group'}
        properties={{
          title: content.title,
          itemId,
        }}
      />
      {renderContent({ content, loading, error })}
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
