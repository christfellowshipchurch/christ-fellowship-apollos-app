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
        }
        ... on UniversalContentItem {
          tags
        }
        ... on DevotionalContentItem {
          tags
        }
        ... on MediaContentItem {
          tags
        }
        ... on EventContentItem {
          nextOccurrence
          events {
            start
          }
        }
        ... on InformationalContentItem {
          redirectUrl
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
        hideLabel
        checkin {
          id
          title
          message
          isCheckedIn
        }
      }
    `,
    INFORMATIONAL_ITEM_FRAGMENT: gql`
      fragment informationalContentItemFragment on InformationalContentItem {
        callsToAction {
          call
          action
        }
        redirectUrl
      }
    `,
    PUBLISH_FRAGMENT: gql`
      fragment publishFragment on ContentItem {
        ... on ContentSeriesContentItem {
          author {
            firstName
            lastName

            photo {
              uri
            }
          }
          estimatedTime
          publishDate
        }
        ... on UniversalContentItem {
          author {
            firstName
            lastName

            photo {
              uri
            }
          }
          estimatedTime
          publishDate
        }
        ... on DevotionalContentItem {
          author {
            firstName
            lastName

            photo {
              uri
            }
          }
          estimatedTime
          publishDate
        }
        ... on MediaContentItem {
          author {
            firstName
            lastName

            photo {
              uri
            }
          }
          estimatedTime
          publishDate
        }
      }
    `,
    LIVE_STREAM_FRAGMENT: gql`
      fragment LiveStreamFragment on LiveStream {
        isLive
        media {
          sources {
            uri
          }
        }

        contentItem {
          id
        }
      }
    `,
  },
});
