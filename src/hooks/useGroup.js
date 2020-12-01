import { useQuery } from '@apollo/react-hooks';
import { get, isEmpty } from 'lodash';

import GET_GROUP from '../group-single/getGroup';

export default function useGroup(id) {
  const { data, ...rest } = useQuery(GET_GROUP, {
    variables: {
      itemId: id,
    },
    skip: isEmpty(id),
    fetchPolicy: 'cache-and-network',
  });

  return {
    group: get(data, 'node', {}),
    ...rest,
  };
}
