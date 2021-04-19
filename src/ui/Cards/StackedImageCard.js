import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import {
  H6,
  styled,
  withTheme,
  withIsLoading,
  ConnectedImage,
  FlexedView,
  CardLabel,
  CardImage,
} from '@apollosproject/ui-kit';
import ThemeMixin from '../DynamicThemeMixin';

const { ImageSourceType } = ConnectedImage;

const CellImage = styled(({ theme }) => ({
  width: '100%',
  borderRadius: theme.sizing.baseBorderRadius,
  overflow: 'hidden',
  marginRight: theme.sizing.baseUnit,
}))(View);

const Image = withTheme(({ theme, isLoading, label }) => ({
  overlayColor:
    !!label && label !== '' ? theme.colors.black : theme.colors.transparent,
  minAspectRatio: 1,
  maxAspectRatio: 1,
}))(CardImage);

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H6);

const Title = styled(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.colors.text.primary,
}))(Text);

const TextContainer = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
  justifyContent: 'center',
  backgroundColor: theme.colors.background.paper,
}))(FlexedView);

const StyledCardLabel = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 12,
  left: 10,
}))(CardLabel);

const Cell = styled(({ theme, placement }) => ({
  paddingLeft: theme.sizing.baseUnit * (placement === 'right' ? 0.75 : 1),
  paddingRight: theme.sizing.baseUnit * (placement === 'left' ? 0.75 : 1),
  marginVertical: theme.sizing.baseUnit * 0.75,
}))(View);

const StackedImageCard = ({
  placement,
  coverImage,
  labelText,
  title,
  summary,
}) => (
  <ThemeMixin>
    <Cell placement={placement}>
      <CellImage>
        <Image source={coverImage} isLoading label={labelText} />
        <StyledCardLabel title={labelText} />
      </CellImage>
      <TextContainer>
        {title !== '' && (
          <Title numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Title>
        )}

        {summary !== '' && (
          <StyledH6 numberOfLines={2} ellipsizeMode="tail">
            {summary}
          </StyledH6>
        )}
      </TextContainer>
    </Cell>
  </ThemeMixin>
);

StackedImageCard.propTypes = {
  onPress: PropTypes.func,
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  labelText: PropTypes.string,
  summary: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  placement: PropTypes.oneOf(['', 'left', 'right']),
};

export default withIsLoading(StackedImageCard);
