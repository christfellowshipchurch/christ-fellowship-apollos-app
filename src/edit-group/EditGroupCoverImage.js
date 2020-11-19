import React from 'react';
import { View, StatusBar, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import {
  styled,
  ActivityIndicator,
  BackgroundView,
  Card,
  CardContent,
  CardImage,
  ErrorCard,
  H3,
  H5,
  PaddedView,
  TouchableScale,
  withTheme,
} from '@apollosproject/ui-kit';

import { useGroup } from '../hooks';

import GET_GROUP_COVER_IMAGES from './getGroupCoverImages';

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
  justifyContent: 'space-between',
  borderColor: 'cyan',
}));

// :: Sub-Components
// ------------------------------------------------------------------

const CoverImageCard = ({ coverImage, current, onPress }) => {
  const imageSource = get(coverImage, 'image.sources[0].uri', null);

  if (!imageSource) return null;

  return (
    <CoverImageCardTouchable onPress={onPress}>
      <Card>
        <Image source={imageSource} />
        <CardContent>
          <Row>
            <H5>{coverImage.name}</H5>
            {current && <H5>{'*** Current ***'}</H5>}
          </Row>
        </CardContent>
      </Card>
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
        <H3>Update Group Cover Photo</H3>
      </PaddedView>

      {loading ? (
        <View style={{ flex: 1, minHeight: 300 }}>
          <ActivityIndicator />
        </View>
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
  const groupId = props.navigation.getParam('groupId');

  // Group Details
  const { group, loading: loadingGroup } = useGroup(groupId);
  const currentCoverImageUri = get(group, 'coverImage.sources[0].uri', null);

  // Cover Image Options
  const { data, loading: loadingCoverImages, error } = useQuery(
    GET_GROUP_COVER_IMAGES,
    {
      fetchPolicy: 'cache-and-network',
    }
  );
  const coverImages = get(data, 'groupCoverImages', []);

  const handleSelectCoverImage = (guid) => {
    console.log('[handleSelectCoverImage] guid:', guid);
    Alert.alert('Cover image selected', `guid: ${guid}`);
    // Works on both Android and iOS
    Alert.alert(
      'Use this Group Cover Photo?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => console.log('✅ Yes'),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('❌ Cancel'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
  };

  console.group('[EditGroupCoverImageConnected]');
  console.log('groupId:', groupId);
  console.log('coverImages:', coverImages);
  console.log('currentCoverImageUri:', currentCoverImageUri);
  console.groupEnd();

  return (
    <EditGroupCoverImage
      {...props}
      loading={loadingGroup || loadingCoverImages}
      error={error}
      currentCoverImageUri={currentCoverImageUri}
      coverImages={coverImages}
      onSelectCoverImage={handleSelectCoverImage}
    />
  );
};

// EditGroupCoverImageConnected.navigationOptions = {
//   header: NavigationHeader,
//   headerTransparent: true,
//   headerMode: 'float',
// };

export default EditGroupCoverImageConnected;
