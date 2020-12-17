import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import { get } from 'lodash';
import { SafeAreaView } from 'react-navigation';

import { fetchMoreResolver } from '@apollosproject/ui-connected';
import {
  styled,
  BodyText,
  Button,
  Card,
  CardImage,
  H3,
  H4,
  Icon,
  PaddedView,
  TouchableScale,
  withTheme,
  FeedView,
  FlexedView,
  BackgroundView,
  CardContent,
} from '@apollosproject/ui-kit';
import ThemeMixin from 'ui/DynamicThemeMixin';

import {
  GET_GROUP_RESOURCE_OPTIONS,
  UPDATE_GROUP_RESOURCE_CONTENT_ITEM,
} from './queries';

const CoverImageShape = PropTypes.shape({
  guid: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.shape({
    sources: PropTypes.arrayOf(
      PropTypes.shape({
        uri: PropTypes.string,
      })
    ),
  }),
});

const mapEdges = (data) =>
  get(data, 'groupResourceOptions.edges', []).map(({ node }) => ({
    ...node,
    date: node.requestedDate,
  }));

// :: Styled Components
// ------------------------------------------------------------------

const StyledSafeAreaView = styled(({ theme }) => ({
  flex: 1,
}))(SafeAreaView);

const ActionLayout = styled(({ theme, hasSummary }) => ({
  flexDirection: 'row',
  /* - `center` works in all situations including 1 line summaries
     * - `flex-end` is needed only for when we have no summary
     */
  alignItems: hasSummary ? 'center' : 'flex-end',
  paddingTop: theme.sizing.baseUnit,
}))(View);

const FlexedActionLayoutText = styled(({ theme }) => ({
  marginRight: theme.sizing.baseUnit, // spaces out text from `ActionIcon`. This has to live here for ActionIcon's loading state
}))(FlexedView);

const CoverImageCardTouchable = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(TouchableScale);

const Content = styled(
  ({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
    paddingHorizontal: theme.sizing.baseUnit * 0.5, // TODO: refactor CardContent to have this be the default
    paddingBottom: theme.sizing.baseUnit * 0.5, // TODO: refactor CardContent to have this be the default
  }),
  'ui-kit.HighlightCard.Content'
)(CardContent);

const Image = withTheme(({ theme }) => ({
  forceRatio: 1,
  imageStyle: { aspectRatio: 1 },
  overlayColor: theme.colors.background.paper,
  overlayType: 'gradient-selected',
}))(CardImage);

const CheckIcon = withTheme(({ theme }) => ({
  name: 'circle-outline-check-mark',
  size: 22,
  fill: theme.colors.primary,
}))(Icon);

const EmptyTextContainer = styled(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
}))(View);

const EmptyText = styled(({ theme }) => ({
  width: 300,
  textAlign: 'center',
}))(BodyText);

// :: Sub-Components
// ------------------------------------------------------------------

const CoverImageCard = ({ title, coverImage, selected, onPress }) => {
  const cardCore = (
    <ThemeMixin>
      <Card>
        <Image source={coverImage} current={selected} />
        <Content>
          <ActionLayout hasSummary={false}>
            <FlexedActionLayoutText>
              <H4 numberOfLines={4}>{title}</H4>
            </FlexedActionLayoutText>
            {selected && <CheckIcon />}
          </ActionLayout>
        </Content>
      </Card>
    </ThemeMixin>
  );

  return (
    <FlexedView>
      {selected ? (
        cardCore
      ) : (
        <CoverImageCardTouchable onPress={onPress}>
          {cardCore}
        </CoverImageCardTouchable>
      )}
    </FlexedView>
  );
};

CoverImageCard.propTypes = {
  title: PropTypes.string,
  coverImage: CoverImageShape.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};
CoverImageCard.defaultProps = {
  selected: false,
};

// :: Connected Component
// ------------------------------------------------------------------
const AddContentItemConnected = (props) => {
  // Navigation props
  const { navigation } = props;
  const groupId = navigation.getParam('groupId');

  // Selection State
  const [selected, setSelected] = useState(null);

  // Content Item Options
  const { loading, error, data, refetch, fetchMore, variables } = useQuery(
    GET_GROUP_RESOURCE_OPTIONS,
    {
      fetchPolicy: 'cache-and-network',
      skip: !groupId,
      variables: {
        groupId,
        input: {
          first: 10,
          after: null,
        },
      },
    }
  );
  const [
    updateContentItem,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_GROUP_RESOURCE_CONTENT_ITEM, {
    update: () => navigation.goBack(null),
  });

  // if (error) return <ErrorCard />;

  const items = mapEdges(data);

  const renderItem = ({ item }) =>
    get(item, 'emptyItem') ? (
      <FlexedView />
    ) : (
      <FlexedView>
        <CoverImageCard
          title={get(item, 'title', '')}
          coverImage={get(item, 'coverImage.sources')}
          onPress={() => setSelected(item.id)}
          selected={item.id === selected}
        />
      </FlexedView>
    );

  return (
    <BackgroundView>
      <StyledSafeAreaView forceInset={{ top: 'always', bottom: 'always' }}>
        <PaddedView>
          <H3 padded>Select Study</H3>
        </PaddedView>

        {items.length ? (
          <FeedView
            numColumns={2}
            content={
              items.length % 2 === 0
                ? items
                : [
                    ...items,
                    {
                      emptyItem: true,
                    },
                  ]
            }
            renderItem={renderItem}
            isLoading={loading || mutationLoading}
            error={error || mutationError}
            fetchMore={fetchMoreResolver({
              collectionName: 'groupResourceOptions.edges',
              fetchMore,
              variables,
              data,
            })}
            refetch={refetch}
          />
        ) : (
          <EmptyTextContainer>
            <EmptyText>
              {`All available studies are already added to your Group's resources`}
            </EmptyText>
          </EmptyTextContainer>
        )}

        <PaddedView>
          <Button
            title="Save"
            onPress={() =>
              updateContentItem({
                variables: { groupId, contentItemId: selected },
              })
            }
            loading={loading || mutationLoading}
            disabled={!selected || loading || mutationLoading}
            pill={false}
          />
        </PaddedView>
      </StyledSafeAreaView>
    </BackgroundView>
  );
};

export default AddContentItemConnected;
