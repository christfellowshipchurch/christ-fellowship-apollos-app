import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
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
