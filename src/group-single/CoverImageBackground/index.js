import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import {
  styled,
  GradientOverlayImage,
  withTheme,
  ImageSourceType,
  FlexedView,
} from '@apollosproject/ui-kit';

const Container = styled(({ theme }) => ({
  /** Idk why, but something weird is going on with the BackgroundView,
   *  so to counter-act this weird mismatched coloring, we'll just set the
   *  background of the entire view to the end of the Background gradient (screen)
   */
  backgroundColor: theme.colors.background.screen,
}))(FlexedView);

const StyledGradientOverlayImage = withTheme(({ theme }) => ({
  overlayColor: theme.colors.screen,
  overlayType: 'featured',
  style: {
    position: 'absolute',
    top: 0,
  },
}))(GradientOverlayImage);

const CoverImageBackground = ({ children, source, isLoading }) => (
  <Container>
    <StyledGradientOverlayImage
      isLoading={!source || isLoading}
      source={source}
      // Sets the ratio of the image
      minAspectRatio={1}
      maxAspectRatio={1}
      // Sets the ratio of the placeholder
      forceRatio={1}
      // No ratios are respected without this
      maintainAspectRatio
    />
    <ScrollView>{children}</ScrollView>
  </Container>
);

CoverImageBackground.propTypes = {
  source: ImageSourceType,
  isLoading: PropTypes.bool,
};

export default CoverImageBackground;
