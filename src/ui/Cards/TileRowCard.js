import React, { PureComponent } from 'react'
import { View, Platform } from 'react-native'
import PropTypes from 'prop-types'

import {
  H4,
  H5,
  H6,
  styled,
  withTheme,
  TouchableScale,
  withIsLoading,
  ConnectedImage,
  FlexedView,
} from '@apollosproject/ui-kit'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const CellImage = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 5.5,
  height: theme.sizing.baseUnit * 5.5,
  borderRadius: 8,
  overflow: 'hidden',
  marginRight: theme.sizing.baseUnit,
}))(View)

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6)

const Title = styled(({ theme }) => ({
  fontWeight: 'bold'
}))(H5)

const TextContainer = styled(({ theme }) => ({
  // marginTop: theme.sizing.baseUnit / 2.5,
  // borderBottomWidth: 0.5,
  height: theme.sizing.baseUnit * 4.25,
  // borderColor: theme.colors.shadows.default,
}))(FlexedView)

const Cell = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  marginVertical: theme.sizing.baseUnit / 4,
  // backgroundColor: theme.colors.background.paper,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))(View)

const Icon = withTheme(({ theme, name }) => ({
  icon: ['fal', name],
  fill: theme.colors.white,
  size: 16,
  style: {
    position: 'absolute',
    right: 5,
    top: 5,
    ...Platform.select(theme.shadows.default)
  }
}))(FontAwesomeIcon)

class TileRowCard extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    coverImage: PropTypes.any, // eslint-disable-line
    label: PropTypes.string,
    summary: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
  }

  render() {
    return (
      <Cell>
        <CellImage>
          <ConnectedImage
            source={this.props.coverImage && this.props.coverImage.sources}
            isLoading
          />
          <Icon name={this.props.icon || 'book-open'} />
        </CellImage>
        <TextContainer>
          <StyledH6>
            {this.props.label}
          </StyledH6>
          <Title numberOfLines={2} ellipsizeMode="tail">
            {this.props.title}
          </Title>
          <StyledH6 numberOfLines={2} ellipsizeMode="tail">
            {this.props.summary}
          </StyledH6>
        </TextContainer>
      </Cell>
    )
  }
}

export default withIsLoading(TileRowCard)
