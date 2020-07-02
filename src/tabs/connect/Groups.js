import React from 'react';
import { Text, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import {
  styled,
  HorizontalDefaultCard,
  HorizontalTileFeed,
  ContentCardConnected,
  TouchableScale,
} from '@apollosproject/ui-kit';

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
  console.log('content', content);

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
        <HorizontalDefaultCard
          coverImage={[
            {
              uri: 'https://picsum.photos/800',
            },
          ]}
          isLoading={item.isLoading}
          title={item.title}
          summary={item.summary}
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
