import { useState, useReducer } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';
import { get } from 'lodash';

export const CURRENT_USER = gql`
  query getCurrentUserProfile {
    currentUser {
      id
      profile {
        id
        firstName
        lastName
        gender
        birthDate

        email
        phoneNumber

        campus {
          ...CampusParts
        }

        photo {
          uri
        }

        address {
          street1
          street2
          city
          state
          postalCode
        }

        communicationPreferences {
          allowSMS
          allowEmail
        }
      }
    }
  }

  ${ApollosConfig.FRAGMENTS.CAMPUS_PARTS_FRAGMENT}
`;

export const UPDATE_CURRENT_USER = gql`
  mutation updateCurrentUserProfile(
    $profileFields: [UpdateProfileInput]!
    $address: AddressInput!
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
  }
`;

const useCurrentUser = () => {
    const { loading: queryLoading, error: queryError, data, ...props } = useQuery(
        CURRENT_USER,
        {
            fetchPolicy: 'cache-and-network',
        }
    );

    const id = get(data, 'currentUser.id', null);
    const profile = get(data, 'currentUser.profile', {});

    const [
        updateProfile,
        { loading: mutationLoading, error: mutationError },
    ] = useMutation(UPDATE_CURRENT_USER, {
        update: async (cache, { data: { updateProfileFields, updateAddress } }) => {
            // read the CURRENT_USER query
            const { currentUser } = cache.readQuery({ query: CURRENT_USER });
            const { birthDate, gender } = updateProfileFields;
            // write to the cache the results of the current cache
            //  and append any new fields that have been returned from the mutation
            await cache.writeQuery({
                query: CURRENT_USER,
                data: {
                    currentUser: {
                        ...currentUser,
                        profile: {
                            ...currentUser.profile,
                            birthDate,
                            gender,
                            address: updateAddress,
                        },
                    },
                },
            });

            // onUpdate();
        },
    });

    return {
        loading: queryLoading || mutationLoading,
        error: queryError || mutationError,
        props,
        data,
        ...props,
        id,
        ...profile,
        updateProfile,
    };
};

export default useCurrentUser;
