import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { formatDistance } from 'date-fns';

import {
  BackgroundView,
  H3,
  UIText,
  styled,
  withTheme,
  PaddedView,
  ConnectedImage,
  ImageSourceType,
} from '@apollosproject/ui-kit';
import ThemeMixin from '../ui/DynamicThemeMixin';

const StyledPadded = styled(() => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}))(PaddedView);

const Title = styled(({ theme }) => ({
  alignItems: 'center',
  textAlign: 'center',
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(H3);

const Message = withTheme(({ theme }) => ({
  style: {
    alignItems: 'center',
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
}))(UIText);

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

const PreLiveStream = ({ title, startDate, theme, coverImage, isLoading }) => {
  const [now, setNow] = useState(new Date());
  const message = isLoading
    ? ''
    : `Starts in ${formatDistance(startDate, new Date())}`;

  useEffect(
    () => {
      /**
       * Run a 30 second timer to check for a new difference in the timer so that we can update the text accordingly
       */
      const interval = setInterval(() => {
        setNow(new Date());
      }, 30000);

      return function cleanup() {
        clearInterval(interval);
      };
    },
    [now]
  );

  return (
    <ThemeMixin theme={theme}>
      <BackgroundView>
        <StyledPadded>
          <ImageContainer>
            <CoverImage source={coverImage} isLoading={isLoading} />
          </ImageContainer>

          <Title bold isLoading={isLoading}>
            {title}
          </Title>
          <Message italic isLoading={isLoading}>
            {message}
          </Message>
        </StyledPadded>
      </BackgroundView>
    </ThemeMixin>
  );
};

PreLiveStream.propTypes = {
  theme: PropTypes.shape({}),
  startDate: PropTypes.instanceOf(Date),
  title: PropTypes.string,
  coverImage: ImageSourceType,
  isLoading: PropTypes.bool,
};

PreLiveStream.defaultProps = {};

export default PreLiveStream;
