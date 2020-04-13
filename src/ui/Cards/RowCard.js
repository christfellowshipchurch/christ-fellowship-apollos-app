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
} from '@apollosproject/ui-kit';
import ThemeMixin from '../DynamicThemeMixin';
import { textStyles } from '.';

const { ImageSourceType } = ConnectedImage;

const Image = styled(({ theme }) => ({
  width: '100%',
  height: '100%',
}))(CardImage);

const ImageContainer = styled(({ theme }) => ({
  width: '25%',
  overflow: 'hidden',
  borderTopLeftRadius: theme.sizing.baseBorderRadius,
  borderBottomLeftRadius: theme.sizing.baseBorderRadius,
}))(View);

const Summary = styled(({ theme }) => ({
  fontWeight: textStyles.summary.fontWeight,
  color: theme[textStyles.summary.color],
}))(H6);

const Title = styled(({ theme }) => ({
  fontWeight: textStyles.title.fontWeight,
  color: theme[textStyles.title.color],
}))(H5);

const Content = styled(({ theme }) => ({
  // height: theme.sizing.baseUnit * 4.25,
  justifyContent: 'center',
  padding: theme.sizing.baseUnit,
}))(FlexedView);

const Cell = styled(({ theme, inCardStack = false }) => ({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))(View);

const StyledCard = styled(({ theme }) => ({
  padding: 0,
}))(Card);

class RowCard extends PureComponent {
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
        <StyledCard>
          <Cell inCardStack={this.props.inCardStack}>
            <ImageContainer>
              <Image source={this.props.coverImage} isLoading />
            </ImageContainer>
            <Content>
              {this.props.label !== '' && <Summary>{this.props.label}</Summary>}

              {this.props.title !== '' && (
                <Title numberOfLines={2} ellipsizeMode="tail">
                  {this.props.title}
                </Title>
              )}

              {this.props.summary !== '' && (
                <Summary numberOfLines={2} ellipsizeMode="tail">
                  {this.props.summary}
                </Summary>
              )}
            </Content>
          </Cell>
        </StyledCard>
      </ThemeMixin>
    );
  }
}

RowCard.displayName = 'RowCard';

export default withIsLoading(RowCard);
