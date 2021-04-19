import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, Image, View } from 'react-native';

import { BlurView } from '@react-native-community/blur';

import {
  styled,
  H2,
  H4,
  H6,
  PaddedView,
  BackgroundView,
  Button,
  ThemeMixin,
  Touchable,
} from '@apollosproject/ui-kit';

import BackgroundComponent from './Background';

const Content = styled({
  flex: 1,
  justifyContent: 'center',
})(PaddedView);

const BrandImage = styled(({ theme }) => ({
  alignSelf: 'center',
}))(Image);

const TextContainer = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 3,
}))(View);

const Title = styled(({ theme, color }) => ({
  marginBottom: theme.sizing.baseUnit,
  ...(color ? { color } : {}),
}))(H2);

const StyledH4 = styled(({ color }) => ({
  ...(color ? { color } : {}),
  fontWeight: 'normal',
}))(H4);

const StyledButton = styled(({ color }) => ({
  textTransform: 'uppercase',
}))(Button);

const PrivacyPolicyText = styled(({ color }) => ({
  ...(color ? { color } : {}),
  fontWeight: 'normal',
}))(H6);

const PrivacyPolicyLink = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit,
}))(View);

const LandingScreen = ({
  title,
  description,
  buttonTitle,
  textColor,
  onPressPrimary,
  onPressSecondary,
}) => (
  <BackgroundView>
    <StatusBar
      barStyle="light-content"
      backgroundColor={'transparent'}
      translucent
    />
    <BackgroundComponent />
    <Content>
      <BrandImage source={require('./main_logo.png')} />
      <TextContainer blurType="xlight">
        <Title color={textColor}>{title}</Title>
        <StyledH4 color={textColor}>{description}</StyledH4>
      </TextContainer>
      <StyledButton
        title={buttonTitle}
        pill={false}
        onPress={onPressPrimary}
        type="primary"
      />
      <Touchable onPress={onPressSecondary}>
        <PrivacyPolicyLink>
          <PrivacyPolicyText color={textColor} padded>
            By using this app, I understand and agree to the following policies
            as laid out by Christ Fellowship Church seen here.
          </PrivacyPolicyText>
        </PrivacyPolicyLink>
      </Touchable>
    </Content>
  </BackgroundView>
);

LandingScreen.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonTitle: PropTypes.string,
  textColor: PropTypes.string, // Use for custom text and `BrandIcon` color when overlaying text on an image or video needs more clarity. Defaults to theme driven colors.
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
  /* Recommended usage:
   * - `Image` (react-native)
   * - `GradientOverlayImage` (@apollosproject/ui-kit) for increased readability
   * - `Video` (react-native-video) because moving pictures!
   */
  BackgroundComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

LandingScreen.defaultProps = {
  title: "We're glad you're here!",
  description:
    'At Christ Fellowship we seek to connect with God in deeper ways and to grow in our relationships with Him and with one another.',
  buttonTitle: "Let's go!",
  onPressPrimary: () => null,
  onPressSecondary: () => null,
};

LandingScreen.navigationOptions = {
  header: null,
};

export default LandingScreen;
