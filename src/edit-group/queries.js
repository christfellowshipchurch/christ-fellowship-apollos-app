import gql from 'graphql-tag';

export const GET_GROUP_COVER_IMAGES = gql`
  query getGroupCoverImages {
    groupCoverImages {
      guid
      name
      image {
        sources {
          uri
        }
      }
    }
  }
`;

export const UPDATE_GROUP_COVER_IMAGE = gql`
  mutation updateGroupCoverImage($imageId: String, $groupId: ID!) {
    updateGroupCoverImage(imageId: $imageId, groupId: $groupId) {
      id
      coverImage {
        sources {
          uri
        }
      }
    }
  }
`;
