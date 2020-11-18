import gql from 'graphql-tag';

export default gql`
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
