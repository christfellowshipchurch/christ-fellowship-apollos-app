import React from 'react';
import { Text, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import {
  styled,
  HorizontalTileFeed,
  TouchableScale,
} from '@apollosproject/ui-kit';

import { HorizontalGroupCard } from '../../ui/Cards';

import { GET_USER_GROUPS } from './queries';

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
};

const Groups = ({ navigation }) => {
  const { data, loading, error } = useQuery(GET_USER_GROUPS);
  const content = get(data, 'currentUser.profile.groups', []);

  const renderItem = ({ item }) => {
    console.log('item***', item);
    return (
      <TouchableScale
        onPress={() => {
          navigation.push('ContentSingle', {
            itemId: item.id,
          });
        }}
      >
        <HorizontalGroupCard
          coverImage={[
            {
              uri: 'https://picsum.photos/800',
            },
          ]}
          isLoading={loading}
          {...item}
        />
      </TouchableScale>
    );
  };

  return (
    <View>
      <Text>TODO: Groups Tab Bar with Buttons Here</Text>
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
