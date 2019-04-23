import getAllLikedContent from 'ChristFellowship/src/tabs/connect/getLikedContent';
import { contentItemFragment } from 'ChristFellowship/src/content-single/getContentItem';

const addItemToLikedContentList = ({ cache, item, variables }) => {
  try {
    const data = cache.readQuery({
      query: getAllLikedContent,
      variables,
    });
    const fullItem = cache.readFragment({
      id: `${item.__typename}:${item.id}`,
      fragment: contentItemFragment,
    });
    const newEdges = [
      fullItem,
      ...data.likedContent.edges.map(({ node }) => node),
    ].map((node) => ({
      __typename: 'ContentItemsConnectionEdge',
      node,
    }));
    cache.writeQuery({
      query: getAllLikedContent,
      variables,
      data: {
        ...data,
        likedContent: {
          ...data.likedContent,
          edges: newEdges,
        },
      },
    });
  } catch (e) {
    console.log(e);
    // Most likely we haven't ran the `getAllLikedContent` query yet.
    // We can safely exit.
  }
};

const removeItemFromLikedContentList = ({ cache, item, variables }) => {
  try {
    const data = cache.readQuery({
      query: getAllLikedContent,
      variables,
    });

    const filteredEdges = data.likedContent.edges.filter(
      ({ node }) => node.id !== item.id
    );

    cache.writeQuery({
      query: getAllLikedContent,
      variables,
      data: {
        ...data,
        likedContent: {
          ...data.likedContent,
          edges: filteredEdges,
        },
      },
    });
  } catch (e) {
    console.log(e);
    // Most likely we haven't ran the `getAllLikedContent` query yet.
    // We can safely exit.
  }
};

const updateLikedContent = ({ liked, cache, item }) => {
  if (liked) {
    addItemToLikedContentList({ cache, item, variables: { first: 3 } });
    addItemToLikedContentList({ cache, item, variables: { first: 20 } });
  } else {
    removeItemFromLikedContentList({ cache, item, variables: { first: 3 } });
    removeItemFromLikedContentList({ cache, item, variables: { first: 20 } });
  }
};

export default updateLikedContent;
