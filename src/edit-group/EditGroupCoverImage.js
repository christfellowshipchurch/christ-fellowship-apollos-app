import React from 'react';
import { View, Platform, StatusBar, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';
import { SafeAreaView } from 'react-navigation';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import {
  styled,
  BodyText,
  ActivityIndicator,
  ErrorCard,
  H3,
  H4,
  BackgroundView,
  withMediaQuery,
} from '@apollosproject/ui-kit';

// import NavigationHeader from '../ui/NavigationHeader';

import GET_GROUP_COVER_IMAGES from './getGroupCoverImages';

// :: Styled Components
// ------------------------------------------------------------------
const StyledSafeAreaView = styled(({ theme }) => ({
  flex: 1,
}))(SafeAreaView);

export const ContentContainer = withMediaQuery(
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
export const FieldContainer = styled(({ theme }) => ({
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

// :: Core Component
// ------------------------------------------------------------------
const EditGroupCoverImage = ({ navigation, group, loading, error }) => {
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
  const coverImagesQuery = useQuery(GET_GROUP_COVER_IMAGES, {
    fetchPolicy: 'cache-and-network',
  });

  const coverImages = {
    loading: coverImagesQuery.loading,
    error: coverImagesQuery.error,
    data: get(coverImagesQuery, 'data.groupCoverImages', []),
  };

  console.log('[EditGroupCoverImageConnected] coverImages:', coverImages);

  return <EditGroupCoverImage {...props} coverImages={coverImages} />;
};

// EditGroupCoverImageConnected.navigationOptions = {
//   header: NavigationHeader,
//   headerTransparent: true,
//   headerMode: 'float',
// };

export default EditGroupCoverImageConnected;
