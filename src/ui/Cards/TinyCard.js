import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import {
  H6,
  H4,
  styled,
  TouchableScale,
  withIsLoading,
  ConnectedImage,
  FlexedView,
  Card,
  CardContent,
  CardImage,
  CardLabel,
  BodyText,
  withTheme,
} from '@apollosproject/ui-kit'

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
  paddingHorizontal: theme.sizing.baseUnit * 0.65, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit, // TODO: refactor CardContent to have this be the default
  paddingTop: theme.sizing.baseUnit * 0.5, // TODO: refactor CardContent to have this be the default
}))(CardContent)

const Title = styled(({ theme }) => ({
  fontSize: 12,
  lineHeight: 14,
  fontWeight: "bold",
  color: theme.colors.darkSecondary
}))(BodyText)

const StyledCard = styled(({ theme }) => ({
  width: 133,
  marginHorizontal: theme.sizing.baseUnit * 0.3,
  borderRadius: 8
}))(Card)

const Image = withTheme(({ theme }) => ({
  minAspectRatio: 1.33,
  maxAspectRatio: 1.33,
  maintainAspectRatio: true,
  overlayColor: theme.colors.darkPrimary,
  overlayType: 'gradient-bottom',
  style: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  }
}))(CardImage)

const TagPositioning = styled(({ theme }) => ({
  marginTop: -theme.sizing.baseUnit * 2,
  marginBottom: theme.sizing.baseUnit,
}))(View)

const Tag = styled(({ theme }) => ({
  color: theme.colors.lightPrimary,
  fontSize: 10,
  lineHeight: 14,
}))(Text)

class TinyCard extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    coverImage: PropTypes.any, // eslint-disable-line
    label: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.string
    ),
  }

  render() {
    console.log(this.props)

    return (
      <StyledCard>
        <Image source={this.props.coverImage} />
        <Content>
          <TagPositioning>
            <Tag>
              {get(this.props, 'tags[0]', '')}
            </Tag>
          </TagPositioning>

          <Title numberOfLines={2}>
            {this.props.title}
          </Title>
        </Content>
      </StyledCard>
    )
  }
}

export default withIsLoading(TinyCard)
