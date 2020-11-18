import React from 'react';
import { View, Platform, StatusBar, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';
import { SafeAreaView } from 'react-navigation';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import {
  styled,
  ActivityIndicator,
  BackgroundView,
  BodyText,
  CardImage,
  ErrorCard,
  H3,
  H4,
  H6,
  withMediaQuery,
  withTheme,
} from '@apollosproject/ui-kit';

import GET_GROUP_COVER_IMAGES from './getGroupCoverImages';

// :: Styled Components
// ------------------------------------------------------------------

const ContentContainer = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
  })),
  styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
    width: 500,
    alignSelf: 'center',
  }))
)(View);

// Read Only Fields that show on the Profile
const FieldContainer = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit * 1.5,
  marginVertical: theme.sizing.baseUnit * 0.75,
}))(View);

const StyledH3 = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
  ...Platform.select({
    android: {
      paddingTop: theme.sizing.baseUnit,
    },
  }),
}))(H3);

const Image = withTheme(({ theme }) => ({
  forceRatio: 1.5,
  imageStyle: { aspectRatio: 1.5 },
}))(CardImage);

// :: Sub-Components
// ------------------------------------------------------------------

const CoverImageItemContainer = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit * 1.5,
}))(View);

const CoverImageItem = ({ item }) => {
  console.log('[rkd] item:', item);
  const imageSource = get(item, 'image.sources[0].uri', null);

  if (!imageSource) return null;

  return (
    <CoverImageItemContainer>
      <Image source={imageSource} label={item.name} />
    </CoverImageItemContainer>
  );
};

// :: Core Component
// ------------------------------------------------------------------
const EditGroupCoverImage = ({
  navigation,
  loading,
  error,
  coverImages = [],
}) => {
  // const currentCoverImage = get(group, 'coverImage.sources[0].uri', null);

  if (loading)
    return (
      <BackgroundView>
        <StatusBar hidden />
        <ActivityIndicator />
      </BackgroundView>
    );

  if (error) return <ErrorCard />;

  return (
    <View>
      <FieldContainer>
        <StyledH3>Edit Group Cover Image</StyledH3>
        {coverImages.map((coverImage) => (
          <CoverImageItem key={coverImage.guid} item={coverImage} />
        ))}
      </FieldContainer>
    </View>
  );
};

EditGroupCoverImage.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

EditGroupCoverImage.defaultProps = {
  loading: false,
  error: null,
};

// :: Connected Component
// ------------------------------------------------------------------
const EditGroupCoverImageConnected = (props) => {
  // Cover images
  const { data, loading, error } = useQuery(GET_GROUP_COVER_IMAGES, {
    fetchPolicy: 'cache-and-network',
  });

  const coverImages = get(data, 'groupCoverImages', []);
  console.log('[EditGroupCoverImageConnected] coverImages:', coverImages);

  return (
    <EditGroupCoverImage
      {...props}
      loading={loading}
      error={error}
      coverImages={coverImages}
    />
  );
};

// EditGroupCoverImageConnected.navigationOptions = {
//   header: NavigationHeader,
//   headerTransparent: true,
//   headerMode: 'float',
// };

export default EditGroupCoverImageConnected;
