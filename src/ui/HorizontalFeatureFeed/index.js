import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { compose, pure } from 'recompose';

import {
  H6,
  styled,
  withPlaceholder,
  Placeholder,
} from '@apollosproject/ui-kit';

const Header = styled(
  ({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit * 0.25,
  }),
  'HorizontalFeatureFeed.Header'
)(View);

const Title = compose(
  styled(
    ({ theme }) => ({
      color: theme.colors.text.tertiary,
    }),
    'HorizontalFeatureFeed.Title'
  ),
  withPlaceholder(Placeholder.Typography, { width: 75 }),
  pure
)(H6);

const Subtitle = styled({}, 'HorizontalFeatureFeed.Subtitle')(H6);
const Container = styled(
  ({ theme, style }) => ({
    paddingHorizontal: theme.sizing.baseUnit * 0.5,
    justifyContent: 'flex-end',
    ...style,
  }),
  'HorizontalFeatureFeed.Container'
)(View);

const HoriztonalFeatureFeed = ({
  isLoading,
  title,
  subtitle,
  Component,
  style,
  ...props
}) => {
  const weHaveAValidTitle = title && title !== '';
  return (
    <Container style={style}>
      {(isLoading || title || subtitle) && ( // only display the Header if we are loading or have a title/subtitle
        <Header>
          {(isLoading || title) && (
            <Title
              isLoading={isLoading && !weHaveAValidTitle}
              numberOfLines={1}
              bold
            >
              {title}
            </Title>
          )}
          {!isLoading &&
            subtitle && <Subtitle numberOfLines={1}>{subtitle}</Subtitle>}
        </Header>
      )}
      <Component {...props} />
    </Container>
  );
};

HoriztonalFeatureFeed.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  isLoading: PropTypes.bool,
};

HoriztonalFeatureFeed.defaultProps = {
  Component: View,
  isLoading: false,
};

export default HoriztonalFeatureFeed;
