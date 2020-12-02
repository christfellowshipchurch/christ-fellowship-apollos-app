import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import {
  H5,
  H6,
  styled,
  withTheme,
  withIsLoading,
  ConnectedImage,
  FlexedView,
  CardImage,
} from '@apollosproject/ui-kit';
import ThemeMixin from '../DynamicThemeMixin';
import LiveLabel from '../LiveLabel';

const { ImageSourceType } = ConnectedImage;

const Image = withTheme(({ theme }) => ({
  forceRatio: 1,
  imageStyle: { aspectRatio: 1 },
  style: {
    flex: 2,
    borderRadius: theme.sizing.baseBorderRadius,
  },
}))(CardImage);

const Title = styled(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.colors.text.primary,
}))(H5);

const Content = styled(({ theme }) => ({
  flex: 5,
  justifyContent: 'center',
  marginLeft: theme.sizing.baseUnit,
  borderBottomColor: theme.colors.text.tertiary,
  borderBottomWidth: StyleSheet.hairlineWidth,
  paddingVertical: theme.sizing.baseUnit,
}))(FlexedView);

const Container = styled(({ theme }) => ({
  flexDirection: 'row',
  paddingHorizontal: theme.sizing.baseUnit,
  paddingVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const RowCard = ({ coverImage, label, title, summary, isLoading, isLive }) => (
  <ThemeMixin>
    <Container>
      <Image source={coverImage} isLoading={isLoading} />

      <Content>
        {isLive && !isLoading && <LiveLabel />}
        {!!label &&
          label !== '' &&
          !isLive &&
          !isLoading && (
            <H6 numberOfLines={1} isLoading={isLoading}>
              {label}
            </H6>
          )}

        {(title !== '' || isLoading) && (
          <Title numberOfLines={1} ellipsizeMode="tail" isLoading={isLoading}>
            {title}
          </Title>
        )}

        {(summary !== '' || isLoading) && (
          <H6 numberOfLines={1} ellipsizeMode="tail" isLoading={isLoading}>
            {summary}
          </H6>
        )}
      </Content>
    </Container>
  </ThemeMixin>
);

RowCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  label: PropTypes.string,
  summary: PropTypes.string,
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  isLive: PropTypes.bool,
};

RowCard.displayName = 'RowCard';

export default withIsLoading(RowCard);
