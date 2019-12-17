import GET_ALL_LIKED_CONTENT from 'ChristFellowship/src/tabs/connect/getLikedContent';
import { BASE_CARD_FRAGMENT } from 'ChristFellowship/src/ui/ContentCardConnected';

const addItemToLikedContentList = ({ cache, item, variables }) => {
  try {
    const data = cache.readQuery({
      query: GET_ALL_LIKED_CONTENT,
      variables,
    });
    const fullItem = cache.readFragment({
      id: `${item.__typename}:${item.id}`,
      fragment: BASE_CARD_FRAGMENT,
      fragmentName: 'baseCardFragment',
    });
    const newEdges = [
      fullItem,
      ...data.likedContent.edges.map(({ node }) => node),
    ].map((node) => ({
      __typename: 'ContentItemsConnectionEdge',
      node: {
        ...node,
        isLiked: true,
      },
    }));
    cache.writeQuery({
      query: GET_ALL_LIKED_CONTENT,
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
      query: GET_ALL_LIKED_CONTENT,
      variables,
    });

    const filteredEdges = data.likedContent.edges.filter(
      ({ node }) => node.id !== item.id
    );

    cache.writeQuery({
      query: GET_ALL_LIKED_CONTENT,
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
