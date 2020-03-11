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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const { ImageSourceType } = ConnectedImage;

const CellImage = styled(({ theme }) => ({
  width: '100%',
  borderRadius: theme.sizing.baseBorderRadius,
  overflow: 'hidden',
  marginRight: theme.sizing.baseUnit,
}))(View);

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6);

const Title = styled(({ theme }) => ({
  fontWeight: 'bold',
}))(H5);

const TextContainer = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
  justifyContent: 'center',
}))(FlexedView);

const Cell = styled(({ theme, placement }) => ({
  paddingLeft: theme.sizing.baseUnit * (placement === 'right' ? 0.75 : 1),
  paddingRight: theme.sizing.baseUnit * (placement === 'left' ? 0.75 : 1),
  marginVertical: theme.sizing.baseUnit * 0.75,
}))(View);

class StackedImageCard extends PureComponent {
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
    placement: PropTypes.oneOf(['', 'left', 'right']),
  };

  render() {
    return (
      <Cell placement={this.props.placement}>
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
    );
  }
}

export default withIsLoading(StackedImageCard);
