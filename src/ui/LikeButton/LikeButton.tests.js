// import React from 'react';
// import renderer from 'react-test-renderer';

// import Providers from 'ChristFellowship/src/Providers';
// import gql from 'graphql-tag';

// import LikeButton from '.';

describe('the LikeButton component', () => {
  it('should render', () => {
    //     const updateLikeEntity = {
    //       request: {
    //         query: gql`
    //           mutation updateLikeEntity($itemId: ID!, $operation: LIKE_OPERATION!) {
    //             updateLikeEntity(
    //               input: { nodeId: $itemId, operation: $operation }
    //             ) {
    //               id
    //               operation
    //               interactionDateTime
    //             }
    //           }
    //         `,
    //         variables: {
    //           itemId: 'asdf',
    //           operation: 'Like',
    //         },
    //       },
    //       result: {
    //         data: {
    //           node: { isLiked: true },
    //         },
    //       },
    //     };
    //     const getLikedContentItem = {
    //       request: {
    //         query: gql`
    //           query getLikedContentItem($itemId: ID!) {
    //             node(id: $itemId) {
    //               ... on ContentItem {
    //                 id
    //                 isLiked
    //               }
    //             }
    //           }
    //         `,
    //         variables: {
    //           itemId: 'asdf',
    //         },
    //       },
    //       result: {
    //         data: {
    //           updateLikeEntity: { operation: 'Like' },
    //         },
    //       },
    //     };
    //     const tree = renderer.create(
    //       <Providers mocks={[updateLikeEntity, getLikedContentItem]}>
    //         <LikeButton itemId={'asdf'} />
    //       </Providers>
    //     );
    //     expect(tree).toMatchSnapshot();
  });
  it('should render when loading', () => {
    //     const updateLikeEntity = {
    //       request: {
    //         query: gql`
    //           mutation updateLikeEntity($itemId: ID!, $operation: LIKE_OPERATION!) {
    //             updateLikeEntity(
    //               input: { nodeId: $itemId, operation: $operation }
    //             ) {
    //               id
    //               operation
    //               interactionDateTime
    //             }
    //           }
    //         `,
    //         variables: {
    //           itemId: 'asdf',
    //           operation: 'Like',
    //         },
    //       },
    //       result: {
    //         data: {
    //           node: { isLiked: true },
    //         },
    //       },
    //     };
    //     const getLikedContentItem = {
    //       request: {
    //         query: gql`
    //           query getLikedContentItem($itemId: ID!) {
    //             node(id: $itemId) {
    //               ... on ContentItem {
    //                 id
    //                 isLiked
    //               }
    //             }
    //           }
    //         `,
    //         variables: {
    //           itemId: 'asdf',
    //         },
    //       },
    //       result: null,
    //     };
    //     const tree = renderer.create(
    //       <Providers mocks={[updateLikeEntity, getLikedContentItem]}>
    //         <LikeButton itemId={'asdf'} />
    //       </Providers>
    //     );
    //     expect(tree).toMatchSnapshot();
  });
});
