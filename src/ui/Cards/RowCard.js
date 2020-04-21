import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  H5,
  styled,
  withTheme,
  withIsLoading,
  ConnectedImage,
  FlexedView,
  Card,
  CardImage,
} from '@apollosproject/ui-kit';
import ThemeMixin from '../DynamicThemeMixin';
import LiveLabel from '../LiveLabel';
import { Summary } from './components';

const { ImageSourceType } = ConnectedImage;

const Image = withTheme(() => ({
  // Sets the ratio of the image
  minAspectRatio: 1,
  maxAspectRatio: 1,
  // Sets the ratio of the placeholder
  forceRatio: 1,
  // No ratios are respected without this
  maintainAspectRatio: true,
  style: {
    flex: 2,
  },
}))(CardImage);

const Title = styled(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.colors.text.primary,
}))(H5);

const Content = styled(({ theme }) => ({
  flex: 5,
  justifyContent: 'center',
  paddingHorizontal: theme.sizing.baseUnit,
}))(FlexedView);

const RowCard = ({
  coverImage,
  label,
  title,
  summary,
  isLoading,
  isLive = true,
}) => (
    <ThemeMixin>
      <Card>
        <View style={{ flexDirection: 'row' }}>
          <Image source={coverImage} isLoading={isLoading} />

          <Content>
            {isLive && <LiveLabel />}
            {label !== '' &&
              !isLive && (
                <Summary numberOfLines={1} isLoading={isLoading}>
                  {label}
                </Summary>
              )}

            {title !== '' && (
              <Title numberOfLines={1} ellipsizeMode="tail" isLoading={isLoading}>
                {title}
              </Title>
            )}

            {summary !== '' && (
              <Summary
                numberOfLines={1}
                ellipsizeMode="tail"
                isLoading={isLoading}
              >
                {summary}
              </Summary>
            )}
          </Content>
        </View>
      </Card>
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
