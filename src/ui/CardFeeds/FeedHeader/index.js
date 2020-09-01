import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';

import {
  Touchable,
  ButtonLink,
  H3,
  H6,
  styled,
  withTheme,
  withPlaceholder,
  Placeholder,
} from '@apollosproject/ui-kit';

const RowHeader = styled(({ theme, viewAll }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
  paddingLeft: theme.sizing.baseUnit,
  ...(viewAll
    ? {}
    : {
        paddingBottom: theme.sizing.baseUnit * 0.5,
        paddingRight: theme.sizing.baseUnit,
      }),
}))(View);

const TitlePosition = styled({
  flexGrow: 2,
})(View);

const Title = compose(
  withPlaceholder(Placeholder.Typography, { width: 150 }),
  pure
)(H3);

const AndroidTouchableFix = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius / 2,
}))(Touchable);

const ButtonLinkSpacing = styled(({ theme }) => ({
  flexDirection: 'row', // correctly positions the loading state
  justifyContent: 'flex-end', // correctly positions the loading state
  paddingVertical: theme.sizing.baseUnit * 0.5, // UX hack to improve tapability.
  paddingHorizontal: theme.sizing.baseUnit, // UX hack to improve tapability.
}))(View);

const FeedHeader = ({ title, onPress, seeMoreText, seeMore, isLoading }) =>
  title && title !== '' ? (
    <RowHeader viewAll={seeMore}>
      <TitlePosition>
        <Title isLoading={isLoading && (!title || title === '')}>{title}</Title>
      </TitlePosition>
      {seeMore &&
        !isLoading && (
          <AndroidTouchableFix onPress={onPress}>
            <ButtonLinkSpacing>
              <H6>
                <ButtonLink>{seeMoreText}</ButtonLink>
              </H6>
            </ButtonLinkSpacing>
          </AndroidTouchableFix>
        )}
    </RowHeader>
  ) : null;

FeedHeader.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  seeMoreText: PropTypes.string,
  seeMore: PropTypes.bool,
  isLoading: PropTypes.bool,
};

FeedHeader.defaultProps = {
  onPress: () => null,
  seeMoreText: 'See more',
  seeMore: true,
  isLoading: false,
};

export default FeedHeader;
