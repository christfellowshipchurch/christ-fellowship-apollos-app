import gql from 'graphql-tag';

export const GROUP_ITEM_FRAGMENT = gql`
  fragment GroupItemFragment on GroupItem {
    title
    summary
    groupType
    resources {
      title
      action
      relatedNode {
        __typename
        id
        ... on Url {
          url
        }

        ... on ContentItem {
          coverImage {
            sources {
              uri
            }
          }
        }
      }
    }

    coverImage {
      sources {
        uri
      }
    }

    leaders: people(isLeader: true) {
      edges {
        node {
          id
          photo {
            uri
          }
        }
      }
    }
  }
`;

export const GROUP_FRAGMENT = gql`
  fragment groupFragment on Group {
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
      id
      ... on Group {
        ...GroupItemFragment
        ...groupFragment
        streamChatChannel {
          id
          channelId
        }
      }

      ... on VolunteerGroup {
        ...GroupItemFragment
        streamChatChannel {
          id
          channelId
        }
      }
    }
  }

  ${GROUP_ITEM_FRAGMENT}
  ${GROUP_FRAGMENT}
`;
