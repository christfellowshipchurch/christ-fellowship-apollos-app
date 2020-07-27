import gql from 'graphql-tag';

export const GROUP_FRAGMENT = gql`
  fragment groupFragment on Group {
    id
    name
    title
    groupType
    summary
    members {
      id
      firstName
      photo {
        uri
      }
    }
    leaders {
      id
      firstName
      photo {
        uri
      }
    }
    schedule
    coverImage {
      sources {
        uri
      }
    }
    avatars
    groupResources {
      title
      url
      contentChannelItem
    }
  }
`;

export default gql`
  query getGroup($itemId: ID!) {
    node(id: $itemId) {
      __typename
      ... on Group {
        ...groupFragment
      }
    }
  }
  ${GROUP_FRAGMENT}
`;
