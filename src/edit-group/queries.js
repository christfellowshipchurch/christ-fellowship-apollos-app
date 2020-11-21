import gql from 'graphql-tag';

// Cover Image
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

// Resources

export const GET_GROUP_RESOURCE_OPTIONS = gql`
  query getGroupResourceOptions {
    groupResourceOptions {
      __typename
      id
      title
    }
  }
`;

export const UPDATE_GROUP_RESOURCE_CONTENT_ITEM = gql`
  mutation updateGroupResourceContentItem(
    $contentItemId: ID!
    $groupId: ID!
    $id: ID
  ) {
    updateGroupResourceContentItem(
      contentItemId: $contentItemId
      groupId: $groupId
      id: $id
    ) {
      id
      resources {
        id
        title
        action
        relatedNode {
          __typename
          id
          ... on Url {
            url
          }
        }
      }
    }
  }
`;

export const UPDATE_GROUP_RESOURCE_URL = gql`
  mutation updateGroupResourceUrl(
    $title: String!
    $url: String!
    $id: ID
    $groupId: ID!
  ) {
    updateGroupResourceUrl(
      title: $title
      url: $url
      groupId: $groupId
      id: $id
    ) {
      id
      resources {
        id
        title
        action
        relatedNode {
          __typename
          id
          ... on Url {
            url
          }
        }
      }
    }
  }
`;

export const REMOVE_GROUP_RESOURCE = gql`
  mutation removeGroupResource($groupId: ID!, $id: ID!) {
    removeGroupResource(groupId: $groupId, id: $id) {
      id
      resources {
        id
        title
        action
        relatedNode {
          __typename
          id
          ... on Url {
            url
          }
        }
      }
    }
  }
`;
