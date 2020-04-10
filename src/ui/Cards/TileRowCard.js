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
} from '@apollosproject/ui-kit';
import ThemeMixin from '../DynamicThemeMixin';

const { ImageSourceType } = ConnectedImage;

const CellImage = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 5.5,
  height: theme.sizing.baseUnit * 5.5,
  borderRadius: theme.sizing.baseBorderRadius,
  overflow: 'hidden',
  marginRight: theme.sizing.baseUnit,
}))(View);

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H6);

const Title = styled(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.colors.text.primary,
}))(H5);

const TextContainer = styled(({ theme }) => ({
  height: theme.sizing.baseUnit * 4.25,
  justifyContent: 'center',
}))(FlexedView);

const Cell = styled(({ theme, inCardStack = false }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  marginVertical: theme.sizing.baseUnit * (inCardStack ? 0.75 : 0.5),
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))(View);

class TileRowCard extends PureComponent {
  static propTypes = {
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

  render() {
    return (
      <ThemeMixin>
        <Cell inCardStack={this.props.inCardStack}>
          <CellImage>
            <ConnectedImage source={this.props.coverImage} isLoading />
          </CellImage>
          <TextContainer>
            {this.props.label !== '' && <StyledH6>{this.props.label}</StyledH6>}

            {this.props.title !== '' && (
              <Title numberOfLines={2} ellipsizeMode="tail">
                {this.props.title}
              </Title>
            )}

            {this.props.summary !== '' && (
              <StyledH6 numberOfLines={2} ellipsizeMode="tail">
                {this.props.summary}
              </StyledH6>
            )}
          </TextContainer>
        </Cell>
      </ThemeMixin>
    );
  }
}

export default withIsLoading(TileRowCard);
