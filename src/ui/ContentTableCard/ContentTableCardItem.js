import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  H6,
  H4,
  styled,
  TouchableScale,
  withIsLoading,
  ConnectedImage,
  FlexedView,
} from '@apollosproject/ui-kit';

const CellImage = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 4,
  height: theme.sizing.baseUnit * 4,
  borderRadius: theme.sizing.baseUnit,
  overflow: 'hidden',
  marginRight: theme.sizing.baseUnit,
}))(View);

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6);

const TextContainer = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit / 2.5,
  borderBottomWidth: 0.5,
  height: theme.sizing.baseUnit * 4.25,
  borderColor: theme.colors.shadows.default,
}))(FlexedView);

const Cell = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  paddingVertical: theme.sizing.baseUnit / 4,
  backgroundColor: theme.colors.background.paper,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))(View);

class ContentTableCardItem extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    imageSource: PropTypes.any, // eslint-disable-line
    label: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
  };

  render() {
    return (
      <TouchableScale
        onPress={() =>
          this.props.onPress({
            id: this.props.id,
            transitionKey: 2,
          })
        }
      >
        <Cell>
          <CellImage>
            <ConnectedImage source={this.props.imageSource} isLoading />
          </CellImage>
          <TextContainer>
            <StyledH6>{this.props.label}</StyledH6>
            <H4 numberOfLines={2} ellipsizeMode="tail">
              {this.props.title}
            </H4>
          </TextContainer>
        </Cell>
      </TouchableScale>
    );
  }
}

export default withIsLoading(ContentTableCardItem);
