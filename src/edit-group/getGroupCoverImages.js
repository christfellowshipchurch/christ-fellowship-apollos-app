import gql from 'graphql-tag';

export default gql`
  query getGroupCoverImages {
    groupCoverImages {
      guid
      image {
        name
        key
        sources {
          uri
        }
      }
    }
  }
`;
