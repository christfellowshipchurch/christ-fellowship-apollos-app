import gql from 'graphql-tag';
import { GROUP_FRAGMENT } from '../../../group-single/getGroup';

export default gql`
  query getCurrentUserGroups {
    currentUser {
      id
      profile {
        id
        groups {
          ... on Group {
            ...groupFragment
          }
        }
      }
    }
  }
  ${GROUP_FRAGMENT}
`;
