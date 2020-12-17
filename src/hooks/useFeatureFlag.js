import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { get } from 'lodash';

const GET_FEATURE_STATUS = gql`
  query getFlagStatus($key: String!) {
    flagStatus(key: $key)
  }
`;

const useFeatureFlag = (props) => {
  const key = get(props, 'key');
  const { data, ...queryProps } = useQuery(GET_FEATURE_STATUS, {
    variables: {
      key,
    },
    skip: !key || key === '',
    fetchPolicy: 'cache-and-network',
  });

  return {
    enabled: get(data, 'flagStatus', 'DISABLED') === 'LIVE',
    ...queryProps,
  };
};

export default useFeatureFlag;
