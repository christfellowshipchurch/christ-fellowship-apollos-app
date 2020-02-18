import gql from 'graphql-tag';

export const GET_EVENTS = gql`
  query getEvents {
    allEvents {
      ...eventsFragment
    }

    featuredEvents {
      edges {
        node {
          ...eventsFragment
        }
      }
    }
  }

  fragment eventsFragment on EventContentItem {
    id
    title
    summary

    nextOccurrence

    coverImage {
      name
      sources {
        uri
      }
    }

    sharing {
      url
      title
      message
    }

    events {
      start
    }
  }
`;
