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

  console.log('\n------------\n[useGroup] id:', id);
  console.log('[useGroup] data:', data);

  return {
    group: get(data, 'node', {}),
    ...rest,
  };
}
