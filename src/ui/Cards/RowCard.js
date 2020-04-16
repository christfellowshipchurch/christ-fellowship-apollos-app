import React, { PureComponent } from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';

import {
  H5,
  H6,
  styled,
  withTheme,
  withIsLoading,
  ConnectedImage,
  FlexedView,
  Card,
  CardImage,
  SideBySideView,
} from '@apollosproject/ui-kit';
import ThemeMixin from '../DynamicThemeMixin';
import { Summary } from './components';

const { ImageSourceType } = ConnectedImage;

const Image = styled({
  aspectRatio: 1,
  height: '100%',
  resizeMode: 'cover',
})(ConnectedImage);

const ImageContainer = styled(({ theme }) => ({
  width: '25%',
  overflow: 'hidden',
  borderTopLeftRadius: theme.sizing.baseBorderRadius,
  borderBottomLeftRadius: theme.sizing.baseBorderRadius,
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const Title = styled(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.colors.text.primary,
}))(H5);

const Content = styled(({ theme }) => ({
  justifyContent: 'center',
  padding: theme.sizing.baseUnit,
}))(FlexedView);

const HorizontalLayout = styled(({ theme }) => ({
  alignItems: 'center',
  height: theme.sizing.baseUnit * 6,
}))(SideBySideView);

const RowCard = ({ coverImage, label, title, summary }) => (
  <ThemeMixin>
    <Card>
      <HorizontalLayout>
        <ImageContainer>
          <Image source={coverImage} isLoading />
        </ImageContainer>
        <Content>
          {label !== '' && <Summary>{label}</Summary>}

          {title !== '' && (
            <Title numberOfLines={2} ellipsizeMode="tail">
              {title}
            </Title>
          )}

          {summary !== '' && (
            <Summary numberOfLines={2} ellipsizeMode="tail">
              {summary}
            </Summary>
          )}
        </Content>
      </HorizontalLayout>
    </Card>
  </ThemeMixin>
);

RowCard.propTypes = {
  onPress: PropTypes.func,
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  label: PropTypes.string,
  summary: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  inCardStack: PropTypes.bool,
};

RowCard.displayName = 'RowCard';

export default withIsLoading(RowCard);
