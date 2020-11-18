import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  styled,
  withIsLoading,
  Card,
  CardContent,
  CardImage,
  BodyText,
  withTheme,
} from '@apollosproject/ui-kit';

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
  paddingHorizontal: theme.sizing.baseUnit * 0.65, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit, // TODO: refactor CardContent to have this be the default
  paddingTop: theme.sizing.baseUnit * 0.5, // TODO: refactor CardContent to have this be the default
}))(CardContent);

const Title = styled(({ theme }) => ({
  fontSize: 12,
  lineHeight: 14,
  fontWeight: 'bold',
  color: theme.colors.text.primary,
}))(BodyText);

const StyledCard = styled(({ theme }) => ({
  // width: 155,
  // height: 175,
  width: 232.5,
  height: 262.5,
  marginHorizontal: theme.sizing.baseUnit * 0.3,
}))(Card);

const Image = withTheme(({ theme, useGradient }) => ({
  // Sets the ratio of the image
  minAspectRatio: 1.33,
  maxAspectRatio: 1.33,
  // Sets the ratio of the placeholder
  forceRatio: 1.33,
  // No ratios are respected without this
  maintainAspectRatio: true,
  overlayColor: theme.colors.black,
  overlayType: useGradient ? 'gradient-bottom-short' : 'gradient-none',
}))(CardImage);

const TagPositioning = styled(({ theme }) => ({
  marginTop: -theme.sizing.baseUnit * 2,
  marginBottom: theme.sizing.baseUnit,
}))(View);

const Tag = styled(({ theme }) => ({
  color: theme.colors.lightPrimary,
  fontSize: 10,
  lineHeight: 14,
}))(Text);

class TinyCard extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    coverImage: PropTypes.any, // eslint-disable-line
    label: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  };

  render() {
    const tag = get(this.props, 'tags[0]', '');

    return (
      <StyledCard>
        <View>
          <Image source={this.props.coverImage} useGradient={tag !== ''} />
        </View>

        <Content>
          <TagPositioning>
            <Tag>{tag}</Tag>
          </TagPositioning>

          <Title numberOfLines={4}>{this.props.title}</Title>
        </Content>
      </StyledCard>
    );
  }
}

export default withIsLoading(TinyCard);
