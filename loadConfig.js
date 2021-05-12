import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';
import gql from 'graphql-tag';
import fragmentTypes from './src/client/fragmentTypes.json';

// Create a map all the interfaces each type implements.
// If UniversalContentItem implements Node, Card, and ContentNode,
// our typemap would be { UniversalContentItem: ['Node', 'Card', 'ContentNode'] }
const TYPEMAP = fragmentTypes.__schema.types.reduce((acc, curr) => {
  const { name } = curr;
  const types = Object.fromEntries(
    curr.possibleTypes.map((type) => [type.name, name])
  );
  Object.keys(types).forEach((key) => {
    acc[key] = acc[key] ? [...acc[key], types[key]] : [types[key]];
  });
  return acc;
}, {});

ApollosConfig.loadJs({
  /**
   * Logs the user out when updated.
   *
   * Uses a date format so that we can go back and audit when a decision to force a log out what made
   *
   * Date Format: yyyy.mm.dd.HH.mm
   */
  SCHEMA_VERSION: '2021.05.06.10.28',
  FRAGMENTS: {
    ...FRAGMENTS,
    USER_PROFILE_PARTS_FRAGMENT: gql`
      fragment UserProfileParts on Person {
        id
        firstName
        nickName
        lastName
        gender
        birthDate

        email
        phoneNumber

        photo {
          uri
        }

        address {
          street1
          street2
          city
          state
          postalCode
        }

        communicationPreferences {
          allowSMS
          allowEmail
        }
      }
    `,
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
          labelText
          eventGroupings {
            name
            instances {
              id
              start
              end
            }
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
        eventGroupings {
          name
          instances {
            id
            start
            end
          }
        }

        callsToAction {
          call
          action
        }

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
        id
        eventStartTime
        eventEndTime
        isLive
        media {
          sources {
            uri
          }
        }

        relatedNode {
          id
          ... on ContentNode {
            title
            coverImage {
              sources {
                uri
              }
            }
          }
        }
      }
    `,
    LIVE_NODE_FRAGMENT: gql`
      fragment LiveNodeFragment on LiveNode {
        liveStream {
          id
          eventStartTime
          eventEndTime
          isLive
          media {
            sources {
              uri
            }
          }
        }
      }
    `,
    LIVE_STREAM_LIST_FEATURE_FRAGMENT: gql`
      fragment LiveStreamListFeatureFragment on LiveStreamListFeature {
        id
        title
        subtitle
        liveStreams {
          id
          eventStartTime
          eventEndTime
          isLive
          media {
            sources {
              uri
            }
          }

          relatedNode {
            id
            ... on ContentNode {
              title
              coverImage {
                sources {
                  uri
                }
              }
            }
          }
        }
      }
    `,
    PRAYER_REQUEST_FRAGMENT: gql`
      fragment PrayerRequestFragment on PrayerRequest {
        id
        text
        requestedDate
        requestor {
          id
          nickName
          firstName
          photo {
            uri
          }
        }
        isAnonymous
        isPrayed
      }
    `,
    ACTION_BAR_FEATURE_FRAGMENT: gql`
      fragment ActionBarFeatureFragment on ActionBarFeature {
        id
        order

        actions {
          title
          action
          icon
          theme {
            ...ThemeFragment
          }
          relatedNode {
            ...RelatedFeatureNodeFragment
          }
        }
      }
    `,
    THEME_FRAGMENT: gql`
      fragment ThemeFragment on Theme {
        type
        colors {
          primary
          secondary
          screen
          paper
          alert
        }
      }
    `,
    GROUP_CARD_FRAGMENT: gql`
      fragment GroupCardFragment on GroupItem {
        title
        coverImage {
          sources {
            uri
          }
        }

        leaders: people(first: 3, isLeader: true) {
          edges {
            node {
              id
              photo {
                uri
              }
            }
          }
          totalCount
        }
        members: people(first: 5, isLeader: false) {
          edges {
            node {
              id
              photo {
                uri
              }
            }
          }
          totalCount
        }

        ... on Group {
          schedule {
            friendlyScheduleText
          }
          dateTime {
            start
            end
          }
        }
      }
    `,
    AVATAR_LIST_FRAGMENT: gql`
      fragment AvatarListFeatureFragment on AvatarListFeature {
        id
        order

        people {
          id
          firstName
          lastName

          photo {
            uri
          }

          campus {
            id
            name
          }
        }

        isCard

        primaryAction {
          action
          icon
          theme {
            ...ThemeFragment
          }
          relatedNode {
            ...RelatedFeatureNodeFragment
          }
        }
      }
    `,
    HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT: gql`
      fragment HorizontalCardListFeatureFragment on HorizontalCardListFeature {
        id
        title
        subtitle
        cards {
          id
          action
          title
          hyphenatedTitle: title(hyphenated: true)
          hasAction
          actionIcon
          labelText
          summary
          coverImage {
            sources {
              uri
            }
          }
          relatedNode {
            ...RelatedFeatureNodeFragment
          }
        }
        cardType
        primaryAction {
          title
          action
          relatedNode {
            ...RelatedFeatureNodeFragment
          }
        }
      }
    `,
    STREAM_CHAT_FRAGMENT: gql`
      fragment StreamChatChannelNodeFragment on StreamChatChannelNode {
        streamChatChannel {
          id
          channelId
          channelType
        }
      }
    `,
    VERTICAL_CARD_LIST_FEATURE_FRAGMENT: gql`
      fragment VerticalCardListFeatureFragment on VerticalCardListFeature {
        id
        isFeatured
        title
        subtitle
        cards {
          id
          action
          title
          hasAction
          actionIcon
          labelText
          summary
          coverImage {
            sources {
              uri
            }
          }
          relatedNode {
            ...RelatedFeatureNodeFragment
          }
        }
      }
    `,
    RELATED_NODE_FRAGMENT: gql`
      fragment RelatedFeatureNodeFragment on Node {
        id
        ... on Url {
          url
        }
        ... on ContentChannel {
          name
        }
      }
    `,
    CONTENT_BLOCK_FEATURE_FRAGMENT: gql`
      fragment ContentBlockFeatureFragment on ContentBlockFeature {
        title
        subtitle
        htmlContent

        coverImage {
          sources {
            uri
          }
        }
        videos {
          sources {
            uri
          }
        }

        actions {
          title
          action
          relatedNode {
            ...RelatedFeatureNodeFragment
          }
        }

        orientation
      }
    `,
  },
  FEATURE_FEEDS: {
    horizontalCardListLength: 3,
    verticalCardListLength: 3,
    heroListLength: 3,
  },
  TYPEMAP,
});
