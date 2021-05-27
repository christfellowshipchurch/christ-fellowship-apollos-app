import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { get } from 'lodash';
import Color from 'color';

import {
  View,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
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
  H6,
  Touchable,
  TouchableScale,
  withMediaQuery,
  withTheme,
} from '@apollosproject/ui-kit';

import { useGroup } from '../hooks';

import ResourcesSection from './ResourcesSection';

// :: Styled Components
// ------------------------------------------------------------------

export const ContentContainer = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  styled(({ theme }) => ({
    marginTop: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
  })),
  styled(({ theme }) => ({
    marginTop: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
    width: 500,
    alignSelf: 'center',
  }))
)(View);

// Read Only Fields that show on the Profile
export const FieldContainer = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit * 2,
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

// :: Core Component
// ------------------------------------------------------------------

const EditGroup = ({ group, loading, error }) => {
  const navigation = useNavigation();
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
  const navigateToAddContentItem = () =>
    navigation.navigate('AddContentItem', {
      groupId: group.id,
    });

  return (
    <BackgroundView>
      <StatusBar hidden />
      <ScrollView>
        <KeyboardAvoidingView behavior={'padding'}>
          <ContentContainer>
            {loading && (
              <Overlay>
                <ActivityIndicator />
              </Overlay>
            )}

            {/**
             *  TODO : image isn't updating for some reason after save
             */}
            {/* <FieldContainer>
              <RowHeader>
                <Name>
                  <H3>Cover Photo</H3>
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
            </FieldContainer> */}
            <FieldContainer>
              <RowHeader>
                <Name>
                  <H3>Resources</H3>
                </Name>
              </RowHeader>
              <ResourcesSection
                groupId={group.id}
                onAddContentItem={navigateToAddContentItem}
              />
            </FieldContainer>
          </ContentContainer>
        </KeyboardAvoidingView>
      </ScrollView>
    </BackgroundView>
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
  const id = props.route?.params?.id;
  const { group, loading } = useGroup(id);

  return <EditGroup {...props} group={group} loading={loading} />;
};

EditGroupConnected.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default EditGroupConnected;
