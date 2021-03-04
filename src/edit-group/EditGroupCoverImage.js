import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation } from '@apollo/client';
import { get } from 'lodash';

import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  styled,
  Card,
  CardImage,
  ErrorCard,
  H3,
  Icon,
  PaddedView,
  TouchableScale,
  withTheme,
  FeedView,
  FlexedView,
  BackgroundView,
} from '@apollosproject/ui-kit';
import ThemeMixin from 'ui/DynamicThemeMixin';

import { GET_GROUP_COVER_IMAGES, UPDATE_GROUP_COVER_IMAGE } from './queries';

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

// :: Styled Components
// ------------------------------------------------------------------

const StyledSafeAreaView = styled(({ theme }) => ({
  flex: 1,
}))(SafeAreaView);

const CoverImageCardTouchable = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(TouchableScale);

const Image = withTheme(({ theme, current }) => ({
  forceRatio: 1,
  imageStyle: { aspectRatio: 1 },
  ...(current
    ? {
        overlayColor: theme.colors.background.paper,
        overlayType: 'gradient-selected',
      }
    : {}),
}))(CardImage);

const CheckIcon = withTheme(({ theme }) => ({
  name: 'circle-outline-check-mark',
  size: 22,
  fill: theme.colors.primary,
  style: {
    marginLeft: theme.sizing.baseUnit / 2,
    position: 'absolute',
    right: theme.sizing.baseUnit / 2,
    bottom: theme.sizing.baseUnit / 2,
  },
}))(Icon);

// :: Sub-Components
// ------------------------------------------------------------------

const CoverImageCard = ({ coverImage, current, onPress }) => {
  const imageSource = get(coverImage, 'image.sources[0].uri', null);

  if (!imageSource) return null;

  const cardCore = (
    <ThemeMixin>
      <Card>
        <Image source={imageSource} current={current} />
        {current && <CheckIcon />}
      </Card>
    </ThemeMixin>
  );

  return (
    <FlexedView>
      {current ? (
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
  coverImage: CoverImageShape.isRequired,
  onPress: PropTypes.func.isRequired,
  current: PropTypes.bool,
};
CoverImageCard.defaultProps = {
  current: false,
};

// :: Core Component
// ------------------------------------------------------------------
const EditGroupCoverImage = ({
  loading,
  error,
  currentCoverImageUri,
  coverImages = [],
  onSelectCoverImage,
}) => {
  if (error) return <ErrorCard />;

  const renderItem = ({ item: coverImage }) => (
    <CoverImageCard
      key={coverImage.guid}
      coverImage={coverImage}
      onPress={() => onSelectCoverImage(coverImage.guid)}
      current={
        get(coverImage, 'image.sources[0].uri', null) === currentCoverImageUri
      }
    />
  );

  return (
    <BackgroundView>
      <StyledSafeAreaView>
        <FeedView
          numColumns={2}
          content={coverImages}
          renderItem={renderItem}
          isLoading={loading}
          keyExtractor={(item) => item.guid}
        />
      </StyledSafeAreaView>
    </BackgroundView>
  );
};

EditGroupCoverImage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  coverImages: PropTypes.arrayOf(CoverImageShape).isRequired,
  onSelectCoverImage: PropTypes.func.isRequired,
  currentCoverImageUri: PropTypes.string,
};

EditGroupCoverImage.defaultProps = {
  loading: false,
  error: null,
};

// :: Connected Component
// ------------------------------------------------------------------
const EditGroupCoverImageConnected = (props) => {
  // Navigation props
  const navigation = useNavigation();
  const groupId = props.route?.params?.groupId;
  const currentCoverImageUri = props.route?.params?.currentCoverImageUri;

  // Cover Image Options
  const { data, loading, error } = useQuery(GET_GROUP_COVER_IMAGES, {
    fetchPolicy: 'cache-and-network',
  });
  const [updateCoverImage] = useMutation(UPDATE_GROUP_COVER_IMAGE);

  // Event handler
  const handleSelectCoverImage = (guid) => {
    Alert.alert(
      'Update Group Cover Photo',
      'Use this photo instead?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            await updateCoverImage({
              variables: { imageId: guid, groupId },
            });
            navigation.goBack();
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <EditGroupCoverImage
      {...props}
      loading={loading}
      error={error}
      currentCoverImageUri={currentCoverImageUri}
      coverImages={get(data, 'groupCoverImages', [])}
      onSelectCoverImage={handleSelectCoverImage}
    />
  );
};

EditGroupCoverImageConnected.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      groupId: PropTypes.string,
      currentCoverImageUri: PropTypes.string,
    }),
  }),
};

export default EditGroupCoverImageConnected;
