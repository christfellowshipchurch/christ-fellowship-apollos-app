import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import {
  BackgroundView,
  H3,
  styled,
  withTheme,
  PaddedView,
  ConnectedImage,
  ImageSourceType,
} from '@apollosproject/ui-kit';
import ThemeMixin from 'ui/DynamicThemeMixin';

const StyledPadded = styled(() => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}))(PaddedView);

const Title = styled(({ theme }) => ({
  alignItems: 'center',
  textAlign: 'center',
}))(H3);

const ImageContainer = styled(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius,
  overflow: 'hidden',
  paddingBottom: theme.sizing.baseUnit,
}))(View);

const CoverImage = withTheme(({ theme }) => ({
  forceRatio: 16 / 9,
  style: {
    borderRadius: theme.sizing.baseBorderRadius,
    width: '100%',
  },
}))(ConnectedImage);

const PostLiveStream = ({ theme, coverImage }) => (
  <ThemeMixin theme={theme}>
    <BackgroundView>
      <StyledPadded>
        <ImageContainer>
          <CoverImage source={coverImage} />
        </ImageContainer>

        <Title bold>{'Thanks for joining us!'}</Title>
      </StyledPadded>
    </BackgroundView>
  </ThemeMixin>
);

PostLiveStream.propTypes = {
  theme: PropTypes.shape({}),
  coverImage: ImageSourceType,
};

PostLiveStream.defaultProps = {};

export default PostLiveStream;
