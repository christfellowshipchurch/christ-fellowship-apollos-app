import React from 'react';
import { View, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { get } from 'lodash';

import {
  styled,
  ActivityIndicator,
  Card,
  CardContent,
  CardImage,
  ErrorCard,
  H3,
  H4,
  Icon,
  PaddedView,
  TouchableScale,
  withTheme,
} from '@apollosproject/ui-kit';

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

const LoadingContainer = styled(({ theme }) => ({
  flex: 1,
  minHeight: 300,
}))(View);

const CoverImageCardTouchable = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(TouchableScale);

const Image = withTheme(({ theme }) => ({
  forceRatio: 1.78,
  imageStyle: { aspectRatio: 1.78 },
}))(CardImage);

const Row = styled(({ theme }) => ({
  flex: 1,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'flex-start',
}))(View);

const CheckIcon = withTheme(({ theme }) => ({
  name: 'check',
  size: 22,
  fill: theme.colors.primary,
  style: {
    marginLeft: theme.sizing.baseUnit / 2,
  },
}))(Icon);

// :: Sub-Components
// ------------------------------------------------------------------

const CoverImageCard = ({ coverImage, current, onPress }) => {
  const imageSource = get(coverImage, 'image.sources[0].uri', null);

  if (!imageSource) return null;

  const cardCore = (
    <Card>
      <Image source={imageSource} />
      <CardContent>
        <Row>
          <H4>{coverImage.name}</H4>
          {current && <CheckIcon />}
        </Row>
      </CardContent>
    </Card>
  );

  if (current) {
    return cardCore;
  }

  return (
    <CoverImageCardTouchable onPress={onPress}>
      {cardCore}
    </CoverImageCardTouchable>
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

  return (
    <View>
      <PaddedView>
        <H3 padded>Update Group Cover Photo</H3>
      </PaddedView>

      {loading ? (
        <LoadingContainer>
          <ActivityIndicator />
        </LoadingContainer>
      ) : (
        coverImages.map((coverImage) => (
          <CoverImageCard
            key={coverImage.guid}
            coverImage={coverImage}
            onPress={() => onSelectCoverImage(coverImage.guid)}
            current={
              get(coverImage, 'image.sources[0].uri', null) ===
              currentCoverImageUri
            }
          />
        ))
      )}
    </View>
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
  const { navigation } = props;
  const groupId = navigation.getParam('groupId');
  const currentCoverImageUri = navigation.getParam('currentCoverImageUri');

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

export default EditGroupCoverImageConnected;
