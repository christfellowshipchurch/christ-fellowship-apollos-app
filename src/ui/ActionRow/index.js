import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  Button,
  BodySmall,
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

const Content = styled(({ theme, hasMedia }) => ({
  flex: 5,
  justifyContent: 'center',
  marginLeft: hasMedia ? theme.sizing.baseUnit : 0,
  paddingVertical: theme.sizing.baseUnit,
}))(FlexedView);

const Container = styled(({ theme }) => ({
  flexDirection: 'row',
  paddingHorizontal: theme.sizing.baseUnit,
  paddingVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const PillButton = styled(({ theme }) => ({
  height: theme.sizing.baseUnit * 1.5,
  alignSelf: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 0,
}))(Button);

const RowCard = ({
  coverImage,
  labelText,
  title,
  summary,
  isLoading,
  isLive,
}) => (
  <ThemeMixin>
    <Container>
      {!!coverImage && <Image source={coverImage} isLoading={isLoading} />}

      <Content hasMedia={!!coverImage}>
        {isLive && !isLoading && <LiveLabel />}
        {!isEmpty(labelText) &&
          !isLive && (
            <H6 numberOfLines={1} isLoading={isLoading}>
              {labelText}
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

      {!coverImage && (
        <PillButton>
          <BodySmall bold>See More</BodySmall>
        </PillButton>
      )}
    </Container>
  </ThemeMixin>
);

RowCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  labelText: PropTypes.string,
  summary: PropTypes.string,
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  isLive: PropTypes.bool,
};

RowCard.displayName = 'RowCard';

export default withIsLoading(RowCard);
