import React from 'react';
import { Text, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import { GET_USER_GROUPS } from './queries';

const Groups = () => {
  const { data, loading, error } = useQuery(GET_USER_GROUPS);
  const groups = get(data, 'currentUser.profile');
  console.log('groups', groups);
  return (
    <View>
      <Text>TODO: Groups Tab Bar with Buttons Here</Text>
      <Text>TODO: Horizontal Scrolling Cards Here</Text>
    </View>
  );
};

Groups.propTypes = {};

export default Groups;
