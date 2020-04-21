import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  withTheme,
  styled,
  Card,
  CardImage,
  CardContent,
  H6,
  withIsLoading,
  ConnectedImage,
} from '@apollosproject/ui-kit';
import ThemeMixin from '../../DynamicThemeMixin';
import { Title, Summary } from '../components';
import LiveLabel from '../../LiveLabel';
import CardContentWrapper from './CardContentWrapper';

const { ImageSourceType } = ConnectedImage;

const Image = withTheme(({ theme, label }) => ({
  minAspectRatio: 1.2,
  maxAspectRatio: 1.78,
  maintainAspectRatio: true,
}))(CardImage);

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
}))(CardContent);

const Label = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H6);

const HighlightCard = withIsLoading(
  ({ coverImage, title, isLiked, isLoading, labelText, summary, isLive }) => (
    <ThemeMixin>
      <Card isLoading={isLoading}>
        <Image source={coverImage} label={labelText} />

        <CardContentWrapper coverImage={coverImage}>
          <Content>
            {isLive && !isLoading && <LiveLabel BackgroundComponent={View} />}
            {!!labelText &&
              !isLive && <Label numberOfLines={2}>{labelText}</Label>}
            {title || isLoading ? (
              <Title isLoading={isLoading}>{title}</Title>
            ) : null}
            {summary || isLoading ? (
              <Summary isLoading={isLoading}>{summary}</Summary>
            ) : null}
          </Content>
        </CardContentWrapper>

        {/* {isLiked != null ? (
          <LikeIconPositioning>
            <LikeIcon isLiked={isLiked} />
          </LikeIconPositioning>
        ) : null} */}
      </Card>
    </ThemeMixin>
  )
);

HighlightCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  title: PropTypes.string,
  isLiked: PropTypes.bool,
  isLive: PropTypes.bool,
  LabelComponent: PropTypes.element,
  labelText: PropTypes.string,
  summary: PropTypes.string,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
};

HighlightCard.displayName = 'HighlightCard';

export default HighlightCard;
