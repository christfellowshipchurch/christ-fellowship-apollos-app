import gql from 'graphql-tag';

export const GET_FIELD_OPTIONS = gql`
  query getFieldOptions {
    stateOptions
    genderOptions
  }
`;

export const GET_USER_PHOTO = gql`
  query CurrentUserPhoto {
    currentUser {
      id
      profile {
        id
        photo {
          uri
        }
      }
    }
  }
`;
