import React from 'react';
import { View, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';
import { get } from 'lodash';

import {
  styled,
  ActivityIndicator,
  BackgroundView,
  ButtonLink,
  Card,
  CardImage,
  ErrorCard,
  FlexedView,
  H3,
  H4,
  H6,
  PaddedView,
  Touchable,
  TouchableScale,
  withMediaQuery,
  withTheme,
} from '@apollosproject/ui-kit';

// import NavigationHeader from '../ui/NavigationHeader';

import { useGroup } from '../hooks';

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

// ✂️ From TileContentFeed --------------------------------------------------------
const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: theme.sizing.baseUnit,
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
  forceRatio: 1.78,
  imageStyle: { aspectRatio: 1.78 },
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

  const handleUpdateGroupCoverImagePress = () =>
    navigation.navigate('EditGroupCoverImage', {
      groupId: group.id,
      currentCoverImageUri: coverImage,
    });

  return (
    <View>
      {loading && (
        <Overlay>
          <ActivityIndicator />
        </Overlay>
      )}
      <PaddedView>
        <H3 padded>Customize my Group</H3>
      </PaddedView>

      <FieldContainer>
        <RowHeader>
          <Name>
            <H4>Cover Photo</H4>
          </Name>
          <AndroidTouchableFix onPress={handleUpdateGroupCoverImagePress}>
            <ButtonLinkSpacing>
              <H6>
                <ButtonLink>Update</ButtonLink>
              </H6>
            </ButtonLinkSpacing>
          </AndroidTouchableFix>
        </RowHeader>
        <TouchableScale onPress={handleUpdateGroupCoverImagePress}>
          <Card>
            <Image source={coverImage} />
          </Card>
        </TouchableScale>
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
  group: PropTypes.shape({
    id: PropTypes.string,
    coverImage: PropTypes.shape({
      sources: PropTypes.arrayOf(
        PropTypes.shape({
          uri: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
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

  return <EditGroup {...props} group={group} />;
};

export default EditGroupConnected;
