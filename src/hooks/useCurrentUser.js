import { useQuery, useMutation } from '@apollo/client';
import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';
import { get } from 'lodash';

export const CURRENT_USER = gql`
  query getCurrentUserProfile {
    currentUser {
      id
      streamChatToken
      profile {
        ...UserProfileParts

        campus {
          ...CampusParts
        }
      }
    }
  }

  ${ApollosConfig.FRAGMENTS.CAMPUS_PARTS_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.USER_PROFILE_PARTS_FRAGMENT}
`;

export const UPDATE_CURRENT_USER = gql`
  mutation updateCurrentUserProfile(
    $profileFields: [UpdateProfileInput]!
    $address: AddressInput!
    $communicationPreferences: [UpdateCommunicationPreferenceInput]!
  ) {
    updateProfileFields(input: $profileFields) {
      id
      firstName
      lastName
      gender
      birthDate
    }

    updateAddress(address: $address) {
      street1
      street2
      city
      state
      postalCode
    }

    updateCommunicationPreferences(input: $communicationPreferences) {
      communicationPreferences {
        allowEmail
        allowSMS
      }
    }
  }
`;

export const UPDATE_CURRENT_USER_PROFILE_FIELD = gql`
  mutation updateCurrentUserProfileField($profileField: UpdateProfileInput!) {
    updateProfileField(input: $profileField) {
      ...UserProfileParts
    }
  }

  ${ApollosConfig.FRAGMENTS.USER_PROFILE_PARTS_FRAGMENT}
`;

export const UPDATE_CURRENT_USER_ADDRESS = gql`
  mutation updateCurrentUserProfileField($address: AddressInput!) {
    updateAddress(address: $address) {
      street1
      street2
      city
      state
      postalCode
    }
  }
`;

export const UPDATE_CURRENT_USER_COMMUNICATION_PREFERENCE = gql`
  mutation updateCurrentUserProfileField(
    $type: UPDATEABLE_COMMUNICATION_PREFERENCES!
    $allow: Boolean!
  ) {
    updateCommunicationPreference(type: $type, allow: $allow) {
      communicationPreferences {
        allowEmail
        allowSMS
      }
    }
  }
`;

const useCurrentUser = (props) => {
  const {
    loading: queryLoading,
    error: queryError,
    data,
    ...queryProps
  } = useQuery(CURRENT_USER, {
    fetchPolicy: 'cache-and-network',
  });

  const id = get(data, 'currentUser.id', null);
  const profile = get(data, 'currentUser.profile', {});

  const writeProfileUpdatesToQuery = async (cache, newProfile) => {
    // read the CURRENT_USER query
    const { currentUser } = await cache.readQuery({ query: CURRENT_USER });

    // write to the cache the results of the current cache
    //  and append any new fields that have been returned from the mutation
    await cache.writeQuery({
      query: CURRENT_USER,
      data: {
        currentUser: {
          ...currentUser,
          profile: { ...currentUser.profile, ...newProfile },
        },
      },
    });
  };

  const onMutationError = () => {
    const onUpdate = get(props, 'onUpdate', () => null);
    onUpdate({ success: false });
  };

  const onMutationSuccess = () => {
    const onUpdate = get(props, 'onUpdate', () => null);
    onUpdate({ success: false });
  };

  const [
    updateProfile,
    { loading: updateProfileLoading, error: updateProfileError },
  ] = useMutation(UPDATE_CURRENT_USER, {
    update: async (
      cache,
      {
        data: {
          updateProfileFields,
          updateAddress,
          updateCommunicationPreferences,
        },
      }
    ) => {
      const profileObjectShape = {
        ...updateProfileFields,
        address: updateAddress,
        communicationPreferences: updateCommunicationPreferences,
      };

      await writeProfileUpdatesToQuery(cache, profileObjectShape);
      onMutationSuccess();
    },
    onError: onMutationError,
  });

  const [
    updateProfileField,
    { loading: updateProfileFieldLoading, error: updateProfileFieldError },
  ] = useMutation(UPDATE_CURRENT_USER_PROFILE_FIELD, {
    update: async (cache, { data: { updateProfileField: updatedProfile } }) => {
      await writeProfileUpdatesToQuery(cache, updatedProfile);
      onMutationSuccess();
    },
    onError: onMutationError,
  });

  const [
    updateAddress,
    { loading: updateAddressLoading, error: updateAddressError },
  ] = useMutation(UPDATE_CURRENT_USER_ADDRESS, {
    update: async (cache, { data: { updateAddress: address } }) => {
      await writeProfileUpdatesToQuery(cache, { address });
      onMutationSuccess();
    },
    onError: onMutationError,
  });

  const [
    updateCommunicationPreference,
    {
      loading: updateCommunicationPreferenceLoading,
      error: updateCommunicationPreferenceError,
    },
  ] = useMutation(UPDATE_CURRENT_USER_COMMUNICATION_PREFERENCE, {
    update: async (
      cache,
      { data: { updateCommunicationPreference: communicationPreferences } }
    ) => {
      await writeProfileUpdatesToQuery(cache, communicationPreferences);
      onMutationSuccess();
    },
    onError: onMutationError,
  });

  return {
    loading:
      queryLoading ||
      updateProfileLoading ||
      updateProfileFieldLoading ||
      updateCommunicationPreferenceLoading ||
      updateAddressLoading,
    error:
      queryError ||
      updateProfileError ||
      updateProfileFieldError ||
      updateCommunicationPreferenceError ||
      updateAddressError,
    data,
    ...queryProps,
    id,
    ...profile,
    updateProfile,
    updateProfileField,
    updateCommunicationPreference,
    updateAddress,
  };
};

export default useCurrentUser;
