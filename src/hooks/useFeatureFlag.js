import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { get, isEmpty } from 'lodash';

const GET_FEATURE_STATUS = gql`
  query getFlagStatus($key: String!) {
    flagStatus(key: $key)
  }
`;

const useFeatureFlag = (props) => {
  console.warn('DEPRECATED : please use `useUserFlag` instead');

  const key = get(props, 'key');
  const { data, ...queryProps } = useQuery(GET_FEATURE_STATUS, {
    variables: {
      key,
    },
    skip: !key || isEmpty(key),
    fetchPolicy: 'network-only',
  });

  return {
    enabled: get(data, 'flagStatus', 'DISABLED') === 'LIVE',
    ...queryProps,
  };
};

export default useFeatureFlag;
