import gql from 'graphql-tag';

export default gql`
  fragment CampusParts on Campus {
    id
    name
    latitude
    longitude
    distanceFromLocation
    street1
    street2
    city
    state
    postalCode
    image {
      uri
    }
  }
`;
