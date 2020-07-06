import React from 'react';
import PropTypes from 'prop-types';

import {
  BodySmall,
  Card,
  CardContent,
  CardImage,
  H5,
  H6,
  ImageSourceType,
  styled,
  withIsLoading,
  withTheme,
} from '@apollosproject/ui-kit';

const SquareCard = styled({
  width: 240,
  height: 240,
})(Card);

const Image = withTheme(({ theme, hasTitleAndSummary }) => ({
  minAspectRatio: hasTitleAndSummary ? 2 : 1.5, // adjusts `Image` height to fill available `Card` whitespace if there is no `Title` or `Summary`
  maxAspectRatio: hasTitleAndSummary ? 2 : 1.5, // adjusts `Image` height to fill available `Card` whitespace if there is no `Title` or `Summary`
  forceRatio: hasTitleAndSummary ? 2 : 1.5, // forces the placeholder to use the same ratio as above.
  maintainAspectRatio: true,
  overlayColor: theme.colors.black,
  overlayType: 'gradient-top',
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

const HorizontalGroupCard = withIsLoading(
  ({ coverImage, isLoading, summary, title, schedule }) => (
    <SquareCard isLoading={isLoading} inHorizontalList>
      <Image source={coverImage} hasTitleAndSummary={!!summary && !!title} />

      <Content>
        {title ? <H5 numberOfLines={2}>{title}</H5> : null}
        {summary ? (
          <Summary hasTitle={title} numberOfLines={2}>
            {summary}
          </Summary>
        ) : null}
        {schedule ? <H6 numberOfLines={2}>{schedule}</H6> : null}
      </Content>
    </SquareCard>
  )
);

HorizontalGroupCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  summary: PropTypes.string,
  title: PropTypes.string,
};

HorizontalGroupCard.displayName = 'HorizontalGroupCard';

export default HorizontalGroupCard;
