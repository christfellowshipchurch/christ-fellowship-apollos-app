import gql from 'graphql-tag';

export default gql`
  query getMembers($groupId: ID!) {
    node(id: $groupId) {
      __typename
      id
      ... on Group {
        members {
          ...GroupMembersFragment
        }
      }

      ... on VolunteerGroup {
        members {
          ...GroupMembersFragment
        }
      }
    }
  }

  fragment GroupMembersFragment on Person {
    id
    firstName
    lastName
    nickName
    photo {
      uri
    }
  }
`;
