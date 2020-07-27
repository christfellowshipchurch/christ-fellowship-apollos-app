import React from 'react';
import { View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import {
  styled,
  HorizontalTileFeed,
  TouchableScale,
  H4,
  PaddedView,
  ErrorCard,
} from '@apollosproject/ui-kit';

import { HorizontalGroupCard } from '../../../ui/Cards';

import GET_CURRENT_USER_GROUPS from './getCurrentUserGroups';

const StyledHorizontalTileFeed = styled(({ theme }) => ({
  /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
   * aligns everything in the same place as if none of the UX hacks were there. */
  marginTop: theme.sizing.baseUnit * -1.25,
  paddingBottom: theme.sizing.baseUnit,
  zIndex: 1,
}))(HorizontalTileFeed);

const loadingStateObject = {
  id: 'fake_id',
  title: '',
  coverImage: [],
  avatars: [],
};

const Groups = ({ navigation }) => {
  const { data, loading, error } = useQuery(GET_CURRENT_USER_GROUPS);
  const content = get(data, 'currentUser.profile.groups', []);

  if (error) return <ErrorCard error={error} />;

  const renderItem = ({ item }) => (
    <TouchableScale
      onPress={() => {
        navigation.push('GroupSingle', {
          itemId: item.id,
        });
      }}
    >
      <HorizontalGroupCard isLoading={loading} error={error} {...item} />
    </TouchableScale>
  );

  return (
    <View>
      <PaddedView>
        <H4>Groups</H4>
      </PaddedView>

      <StyledHorizontalTileFeed
        content={content}
        renderItem={renderItem}
        loadingStateObject={loadingStateObject}
        isLoading={loading}
      />
    </View>
  );
};

Groups.propTypes = {};

export default Groups;
