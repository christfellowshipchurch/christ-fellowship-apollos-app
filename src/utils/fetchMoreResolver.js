import get from 'lodash/get';
import set from 'lodash/fp/set';

export default function fetchMoreResolver({
  collectionName,
  variables,
  fetchMore,
  data,
} = {}) {
  return () => {
    const pageInfoPath = `${collectionName}.pageInfo`;
    const edgePath = `${collectionName}.edges`;

    const after = get(data, `${pageInfoPath}.endCursor`);
    if (!after) return;

    fetchMore({
      variables: { ...variables, after },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        // combine previous data and fetchMore data
        const newDataWithPageInfo = set(
          pageInfoPath,
          {
            ...get(previousResult, pageInfoPath, {}),
            ...get(fetchMoreResult, pageInfoPath, {}),
          },
          previousResult
        );
        const newDataWithAdditionalItems = set(
          edgePath,
          [
            ...get(previousResult, edgePath, []),
            ...get(fetchMoreResult, edgePath, []),
          ],
          newDataWithPageInfo
        );

        return newDataWithAdditionalItems;
      },
    });
  };
}
