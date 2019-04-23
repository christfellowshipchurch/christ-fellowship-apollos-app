import gql from 'graphql-tag';

export default gql`
  query GetScripture($query: String!) {
    scripture(query: $query) {
      reference
      html
      copyright
    }
  }
`;
