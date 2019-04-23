import React, { memo } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  Icon,
  H1,
  H4,
  PaddedView,
} from '@apollosproject/ui-kit';

import Slide from '../Onboarding/Slide';

const Content = styled({
  flex: 1,
  justifyContent: 'center',
})(PaddedView);

const BrandIcon = withTheme(({ theme, isLight }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: isLight ? theme.colors.text.primary : theme.colors.white,
  style: {
    marginBottom: theme.sizing.baseUnit,
  },
}))(Icon);

const Title = styled(({ theme, isLight }) => ({
  color: isLight ? theme.colors.text.primary : theme.colors.white,
  marginBottom: theme.sizing.baseUnit * 2,
}))(H1);

const CoverImage = styled({
  resizeMode: 'cover',
  position: 'absolute',
})(Image);

const StyledH4 = styled(({ theme, isLight }) => ({
  color: isLight ? theme.colors.text.primary : theme.colors.white,
}))(H4);

// eslint-disable-next-line react/display-name
const Splash = memo(
  ({ slideTitle, description, imgSrc, isLight, ...props }) => (
    <Slide {...props}>
      {imgSrc ? <CoverImage source={imgSrc} /> : null}
      <Content>
        <BrandIcon isLight={isLight} />
        <Title isLight={isLight}>{slideTitle}</Title>
        <StyledH4 isLight={isLight}>{description}</StyledH4>
      </Content>
    </Slide>
  )
);

Splash.propTypes = {
  /* The `Swiper` component used in `<onBoarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  imgSrc: PropTypes.string,
  isLight: PropTypes.boolean,
};

Splash.defaultProps = {
  slideTitle: "We're glad you're here.".toUpperCase(),
  description:
    "We're not just a building you go to, but a family to belong to.",
  isLight: true,
};

export default Splash;
