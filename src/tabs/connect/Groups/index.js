import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import { TouchableScale, ErrorCard } from '@apollosproject/ui-kit';
import moment from 'moment';

import { CardFeed } from '../../../ui/CardFeeds';
import { HorizontalGroupCard } from '../../../ui/Cards';

import GET_CURRENT_USER_GROUPS from './getCurrentUserGroups';

const loadingStateObject = {
  id: 'fake_id',
  title: '',
  coverImage: [],
  avatars: [],
};

const GroupsListConnected = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_CURRENT_USER_GROUPS);
  const groups = get(data, 'currentUser.profile.groups', []);

  if (error) return <ErrorCard error={error} />;

  const renderItem = ({ item }) => (
    <TouchableScale
      onPress={() => {
        navigation.navigate('GroupSingle', {
          itemId: item.id,
        });
      }}
    >
      <HorizontalGroupCard isLoading={loading} error={error} {...item} />
    </TouchableScale>
  );

  return (
    <CardFeed
      content={groups.sort((a, b) =>
        moment(a.dateTime.start).diff(b.dateTime.start)
      )}
      renderItem={renderItem}
      loadingStateObject={loadingStateObject}
      isLoading={loading && groups.length === 0}
      error={error}
      cardWidth={212}
      seeMore={false}
      title="My Groups"
      horizontal
    />
  );
};

GroupsListConnected.propTypes = {};

export default GroupsListConnected;
