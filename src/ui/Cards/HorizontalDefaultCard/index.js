import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  withTheme,
  Card,
  CardImage,
  CardContent,
  H5,
  H6,
  BodySmall,
  withIsLoading,
  ConnectedImage,
  ImageSourceType,
  styled,
} from '@apollosproject/ui-kit';

import ThemeMixin from '../../DynamicThemeMixin';
import LiveLabel from '../../LiveLabel';
import BlurView from '../../BlurView';

const SquareCard = styled({
  width: 240,
  height: 240,
})(Card);

const Image = withTheme(({ theme, hasTitleAndSummary }) => ({
  minAspectRatio: hasTitleAndSummary ? 2 : 1.5, // adjusts `Image` height to fill available `Card` whitespace if there is no `Title` or `Summary`
  maxAspectRatio: hasTitleAndSummary ? 2 : 1.5, // adjusts `Image` height to fill available `Card` whitespace if there is no `Title` or `Summary`
  forceRatio: hasTitleAndSummary ? 2 : 1.5, // forces the placeholder to use the same ratio as above.
  maintainAspectRatio: true,
}))(CardImage);

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
  paddingHorizontal: theme.sizing.baseUnit, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
}))(CardContent);

const Summary = styled(({ theme, hasTitle }) => ({
  color: theme.colors.text.tertiary,
  ...(hasTitle ? { paddingTop: theme.sizing.baseUnit / 2 } : {}),
}))(BodySmall);

const LiveLabelPositioning = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: theme.sizing.baseUnit * 0.75,
}))(LiveLabel);

const BlurLabel = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 0.5,
  borderRadius: theme.sizing.baseBorderRadius,
  position: 'absolute',
  bottom: 5,
  left: theme.sizing.baseUnit * 0.75 - theme.sizing.baseUnit * 0.5,
}))(BlurView);

const Label = withTheme(({ theme }) => ({
  numberOfLines: 1,
  style: { color: theme.colors.white },
}))(H6);

const HorizontalDefaultCard = withIsLoading(
  ({ coverImage, isLoading, isLive, summary, title, label }) => (
    <ThemeMixin>
      <SquareCard isLoading={isLoading} inHorizontalList>
        <View>
          <Image
            source={coverImage}
            hasTitleAndSummary={!!summary && !!title}
          />
          {isLive && <LiveLabelPositioning BackgroundComponent={BlurView} />}

          {!!label &&
            label !== '' &&
            !isLive &&
            !isLoading && (
              <BlurLabel blurType="ultraThinMaterial">
                <Label isLoading={isLoading}>{label}</Label>
              </BlurLabel>
            )}
        </View>

        <Content>
          {title ? (
            <H5 numberOfLines={(!label || label === '') && !isLive ? 2 : 1}>
              {title}
            </H5>
          ) : null}
          {summary ? (
            <Summary
              hasTitle={title}
              numberOfLines={(!label || label === '') && !isLive ? 2 : 1}
            >
              {summary}
            </Summary>
          ) : null}
        </Content>
      </SquareCard>
    </ThemeMixin>
  )
);

HorizontalDefaultCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  isLiked: PropTypes.bool,
  summary: PropTypes.string,
  title: PropTypes.string,
};

HorizontalDefaultCard.displayName = 'HorizontalDefaultCard';

export default HorizontalDefaultCard;
