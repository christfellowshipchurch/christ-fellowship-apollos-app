import gql from 'graphql-tag';

export default gql`
  query getMembers($groupId: ID!) {
    node(id: $groupId) {
      __typename
      id
      ... on Group {
        members {
          ...GroupMemebersFragment
        }
      }

      ... on VolunteerGroup {
        members {
          ...GroupMemebersFragment
        }
      }
    }
  }

  fragment GroupMemebersFragment on Person {
    id
    firstName
    nickName
    photo {
      uri
    }
  }
`;
