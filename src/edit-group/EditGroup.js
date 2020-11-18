import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import {
  styled,
  ActivityIndicator,
  BackgroundView,
  ButtonIcon,
  ButtonLink,
  CardImage,
  ErrorCard,
  FlexedView,
  H3,
  H4,
  H6,
  Touchable,
  withMediaQuery,
  withTheme,
} from '@apollosproject/ui-kit';

// import NavigationHeader from '../ui/NavigationHeader';

import { useGroup } from '../hooks';
import GET_GROUP_COVER_IMAGES from './getGroupCoverImages';

// :: Styled Components
// ------------------------------------------------------------------

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

const Overlay = styled(({ theme }) => ({
  alignContent: 'center',
  justifyContent: 'center',
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: Color(theme.colors.background.screen).fade(0.75),
  top: 0,
  left: 0,
  zIndex: 1,
}))(FlexedView);

const StyledH3 = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
  ...Platform.select({
    android: {
      paddingTop: theme.sizing.baseUnit,
    },
  }),
}))(H3);

// ✂️ From TileContentFeed --------------------------------------------------------
const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
}))(View);

const Name = styled({
  flexGrow: 2,
})(View);

const AndroidTouchableFix = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius / 2,
}))(Touchable);

const ButtonLinkSpacing = styled(({ theme }) => ({
  flexDirection: 'row', // correctly positions the loading state
  justifyContent: 'flex-end', // correctly positions the loading state
  padding: theme.sizing.baseUnit, // UX hack to improve tapability.
  paddingRight: 0,
}))(View);

const Image = withTheme(({ theme }) => ({
  forceRatio: 1.5,
  imageStyle: { aspectRatio: 1.5 },
}))(CardImage);

// ✂️ From TileContentFeed --------------------------------------------------------

// :: Core Component
// ------------------------------------------------------------------

const EditGroup = ({ navigation, group, loading, error }) => {
  const coverImage = get(group, 'coverImage.sources[0].uri', null);

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
      {loading && (
        <Overlay>
          <ActivityIndicator />
        </Overlay>
      )}

      <FieldContainer>
        <StyledH3>Customize my Group</StyledH3>
      </FieldContainer>
      <FieldContainer>
        <RowHeader>
          <Name>
            <H4>Cover Photo</H4>
          </Name>
          <AndroidTouchableFix
            onPress={() => navigation.navigate('EditGroupCoverImage')}
          >
            <ButtonLinkSpacing>
              <H6>
                <ButtonLink>Update</ButtonLink>
              </H6>
            </ButtonLinkSpacing>
          </AndroidTouchableFix>
        </RowHeader>
        <Image source={coverImage} />
      </FieldContainer>
      <FieldContainer>
        <RowHeader>
          <Name>
            <H4>Resources</H4>
          </Name>
        </RowHeader>
      </FieldContainer>
    </View>
  );
};

EditGroup.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

EditGroup.defaultProps = {
  loading: false,
  error: null,
};

// :: Connected Component
// ------------------------------------------------------------------
const EditGroupConnected = (props) => {
  // Group data
  const id = props.navigation.getParam('id');
  const { group } = useGroup(id);

  // Cover images
  const coverImagesQuery = useQuery(GET_GROUP_COVER_IMAGES, {
    fetchPolicy: 'cache-and-network',
  });

  const coverImages = {
    loading: coverImagesQuery.loading,
    error: coverImagesQuery.error,
    data: get(coverImagesQuery, 'data.groupCoverImages', []),
  };

  console.log('[EditGroupConnected] group:', group);
  console.log('[EditGroupConnected] coverImages:', coverImages);

  return <EditGroup {...props} group={group} coverImages={coverImages} />;
};

// EditGroupConnected.navigationOptions = {
//   header: NavigationHeader,
//   headerTransparent: true,
//   headerMode: 'float',
// };

export default EditGroupConnected;
