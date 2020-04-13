import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import {
  withTheme,
  styled,
  Card,
  CardImage,
  CardLabel,
  CardContent,
  H4,
  H5,
  H6,
  BodyText,
  Icon,
  withIsLoading,
  ConnectedImage,
  ThemeMixin,
} from '@apollosproject/ui-kit';
import { BlurView } from '@react-native-community/blur';
import { textStyles } from '.';

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

const Summary = styled(({ theme }) => ({
  fontWeight: textStyles.summary.fontWeight,
  color: theme[textStyles.summary.color],
}))(H6);

const Title = styled(({ theme }) => ({
  fontWeight: textStyles.title.fontWeight,
  color: theme[textStyles.title.color],
}))(H4);

const BackgroundImage = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
}))(CardImage);

const StyledCard = styled(({ theme }) => ({}))(Card);

const HighlightCard = withIsLoading(
  ({ coverImage, title, isLiked, isLoading, labelText, summary }) => (
    <StyledCard isLoading={isLoading}>
      <View>
        <Image source={coverImage} label={labelText} />
      </View>

      <View style={{ overflow: 'hidden' }}>
        <BackgroundImage source={coverImage} />
        <BlurView style={StyleSheet.absoluteFill} blurType="chromeMaterial" />
        <Content>
          {labelText ? <Label numberOfLines={2}>{labelText}</Label> : null}
          {title || isLoading ? (
            <Title numberOfLines={2} isLoading={isLoading}>
              {title}
            </Title>
          ) : null}
          {summary || isLoading ? (
            <Summary numberOfLines={2} isLoading={isLoading}>
              {summary}
            </Summary>
          ) : null}
        </Content>
      </View>

      {/* {isLiked != null ? (
          <LikeIconPositioning>
            <LikeIcon isLiked={isLiked} />
          </LikeIconPositioning>
        ) : null} */}
    </StyledCard>
  )
);

HighlightCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  title: PropTypes.string.isRequired,
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
