import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { get, uniq } from 'lodash';

const GET_CHECK_IN = gql`
  query getCheckIn($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ... on CheckInableNode {
        checkin {
          id
          title
          message
          options {
            id
            startDateTime
            isCheckedIn
          }
        }
      }
    }
  }
`;

const DO_CHECK_IN = gql`
  mutation checkInForOptions($id: ID!, $optionIds: [ID]) {
    checkInCurrentUser(id: $id, optionIds: $optionIds) {
      id
      options {
        id
        isCheckedIn
        startDateTime
      }
    }
  }
`;

/**
 * @param {Object} props Hook properties.
 * @param {String} props.nodeId Id for the node that we want to check in for.
 * @param {Function} props.onCheckInSuccess Id for the node that we want to check in for.
 */
const useCheckIn = (props) => {
  const nodeId = get(props, 'nodeId');
  const onCheckInSuccess = get(props, 'onCheckInSuccess');
  /** Hooks */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /** Query for Check In Node */
  const {
    data,
    loading: queryLoading,
    error: queryError,
    ...queryProps
  } = useQuery(GET_CHECK_IN, {
    variables: {
      nodeId,
    },
    skip: !nodeId || nodeId === '',
    fetchPolicy: 'network-only',
  });
  /** Muation for Checking In Current User for a given Check In Option */
  const [
    checkInCurrentUserMutation,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(DO_CHECK_IN, {
    update: async (cache, { data: mutationData }) => {
      const { node } = await cache.readQuery({
        query: GET_CHECK_IN,
        variables: {
          nodeId,
        },
      });

      /** Write to the cache the results of the current cache and append
       *  the updated options that have been returned from the mutation
       */
      await cache.writeQuery({
        query: GET_CHECK_IN,
        data: {
          node: {
            ...node,
            options: mutationData.options,
          },
        },
      });

      if (onCheckInSuccess) onCheckInSuccess();
    },
  });

  /** Effects */
  useEffect(
    () => {
      const currentLoadState = queryLoading || mutationLoading;
      if (loading !== currentLoadState) {
        setLoading(queryLoading || mutationLoading);
      }
    },
    [queryLoading, mutationLoading]
  );

  /** Just to be safe, we want to make sure that we always have some default values since
   *  we're deconstrucing this in the return object
   */
  const checkInId = get(data, 'node.checkin.id');
  const checkInData = {
    title: get(data, 'node.checkin.title', ''),
    message: get(data, 'node.checkin.message', ''),
    options: get(data, 'node.checkin.options', []),
  };

  /**
   * @param {Object}    props
   * @param {string}    optionId  Id of the Check In Option that you want to check in a user to
   * @param {string[]}  optionIds Ids of the Check In Options that you want to check in a user to
   */
  const checkInCurrentUser = ({ optionId, optionIds = [] }) => {
    if (!!optionId || optionIds.length > 0) {
      const oids = uniq([optionId, ...optionIds]).filter((o) => !!o);

      checkInCurrentUserMutation({
        variables: {
          id: checkInId,
          optionIds: oids,
        },
      });
    }
  };

  return {
    ...checkInData,
    nodeId,
    checkInId,
    loading,
    error,
    enabled: !!get(data, 'node') && !!get(data, 'node.checkin'),
    checkInCurrentUser,
    checkInCompleted:
      checkInData.options.filter((o) => o.isCheckedIn).length ===
      checkInData.options.length,
    queryProps: {
      data,
      loading: queryLoading || mutationLoading,
      error: queryError || mutationError,
      ...queryProps,
    },
  };
};

export default useCheckIn;
