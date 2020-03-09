import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';
import gql from 'graphql-tag';

ApollosConfig.loadJs({
  FRAGMENTS: {
    ...FRAGMENTS,
    ACCESSORY_FRAGMENT: gql`
      fragment accessoryFragment on ContentItem {
        ... on ContentSeriesContentItem {
          tags
          icon
        }
        ... on UniversalContentItem {
          tags
          icon
        }
        ... on DevotionalContentItem {
          tags
          icon
        }
        ... on MediaContentItem {
          tags
          icon
        }
        ... on EventContentItem {
          nextOccurrence
          events {
            start
          }
        }
      }
    `,
    CAMPUS_PARTS_FRAGMENT: gql`
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
        featuredImage {
          uri
        }
      }
    `,
    EVENT_ITEM_FRAGMENT: gql`
      fragment eventContentItemFragment on EventContentItem {
        events {
          start
          end
          campuses {
            name
          }
          location
        }
        callsToAction {
          call
          action
        }
      }
    `,
  },
});
