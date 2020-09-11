import gql from 'graphql-tag';

export const GROUP_FRAGMENT = gql`
  fragment groupFragment on Group {
    id
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
    coverImage {
      sources {
        uri
      }
    }
    avatars
    phoneNumbers
    groupResources {
      title
      action
      relatedNode {
        id
        ... on Url {
          url
        }
      }
    }
    dateTime {
      start
      end
    }
    videoCall {
      link
      meetingId
      passcode
      labelText
    }
    parentVideoCall {
      link
      meetingId
      passcode
      labelText
    }
    allowMessages
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
