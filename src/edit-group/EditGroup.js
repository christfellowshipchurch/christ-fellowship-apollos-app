import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import Color from 'color';
import { SafeAreaView } from 'react-navigation';

import {
  GradientOverlayImage,
  styled,
  BodyText,
  ActivityIndicator,
  ErrorCard,
  H4,
  withTheme,
  ThemeMixin,
  TouchableScale,
  BackgroundView,
  FlexedView,
  withMediaQuery,
} from '@apollosproject/ui-kit';

import { useGroup, useCurrentUser } from '../hooks';

const FeaturedImage = withTheme(({ theme }) => ({
  overlayColor: theme.colors.black,
  overlayType: 'gradient-user-profile',
  style: StyleSheet.absoluteFill,
}))(GradientOverlayImage);

const Layout = styled(({ theme }) => ({
  overflow: 'hidden',
}))(View);

const HeaderContainer = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  alignItems: 'center',
  justifyContent: 'center',
  height: 200,
}))(View);

const SaveButton = styled(({ theme, disabled }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: 3,
  fontSize: 12,
  paddingHorizontal: 25,
  fontWeight: 'bold',
  marginVertical: theme.sizing.baseUnit,
  opacity: disabled ? 0.5 : 1,
}))(BodyText);

// Container for the Fields under the
export const ContentContainer = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
    minHeight: 500,
  })),
  styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
    minHeight: 500,
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

const EditGroup = ({ navigation, loading, error }) => {
  const { loading: disabled } = useCurrentUser();

  const id = navigation.getParam('id');
  const { group } = useGroup(id);
  const featuredImage = get(group, 'coverImage.sources[0].uri', null);

  if (loading)
    return (
      <BackgroundView>
        <StatusBar hidden />
        <ActivityIndicator />
      </BackgroundView>
    );

  if (error) return <ErrorCard />;

  return (
    <BackgroundView>
      <StatusBar hidden />
      <KeyboardAvoidingView behavior={'padding'}>
        <ScrollView>
          <ThemeMixin mixin={{ type: 'dark' }}>
            <Layout>
              <FeaturedImage
                isLoading={!featuredImage && loading}
                source={[{ uri: featuredImage }]}
              />
              <SafeAreaView>
                <HeaderContainer>
                  <H4>Edit Group</H4>
                  <TouchableScale
                    onPress={() => {
                      navigation.goBack(null);
                    }}
                    disabled={disabled}
                  >
                    <SaveButton disabled={disabled}>Done</SaveButton>
                  </TouchableScale>
                </HeaderContainer>
              </SafeAreaView>
            </Layout>
          </ThemeMixin>

          <ContentContainer>
            {disabled && (
              <Overlay>
                <ActivityIndicator />
              </Overlay>
            )}

            <FieldContainer>
              <H4>{`Editing group: "${get(group, 'title', '...')}"`}</H4>
            </FieldContainer>
          </ContentContainer>
        </ScrollView>
      </KeyboardAvoidingView>
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
  address: PropTypes.shape({
    street1: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
  }),
  campus: PropTypes.shape({
    name: PropTypes.string,
    featuredImage: PropTypes.shape({
      uri: PropTypes.string,
    }),
  }),
  communicationPreferences: PropTypes.shape({
    allowSMS: PropTypes.bool,
    allowEmail: PropTypes.bool,
  }),
};

EditGroup.defaultProps = {
  loading: false,
  error: null,
  address: {
    street1: '',
    city: '',
    state: '',
    postalCode: '',
  },
  campus: {
    name: '',
    featuredImage: { uri: '' },
  },
  communicationPreferences: {
    allowSMS: false,
    allowEmail: false,
  },
};

const EditGroupConnected = (props) => (
  // const { data } = useQuery(GET_FIELD_OPTIONS, {
  //   fetchPolicy: 'cache-and-network',
  // });

  <EditGroup {...props} />
);

export default EditGroupConnected;
