import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardContent,
  H5,
  styled,
  withIsLoading,
} from '@apollosproject/ui-kit';

import DateLabel from '../../DateLabel';

const CARD_WIDTH = 240;

const CardWrapper = styled(({ customTheme, theme }) => ({
  width: CARD_WIDTH,
  height: 150,
  flex: 1,
}))(Card);

const Content = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  paddingBottom: theme.sizing.baseUnit,
}))(CardContent);

const Text = styled(({ theme }) => ({
  color: theme.colors.text.primary,
}))(H5);

const StyledDateLabel = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(DateLabel);

const HorizontalPrayerRequestCard = withIsLoading(
  ({ text, requestedDate, isLoading }) => (
    <CardWrapper isLoading={isLoading} inHorizontalList>
      <Content>
        {requestedDate ? (
          <StyledDateLabel date={requestedDate} isLoading={isLoading} />
        ) : null}
        {text ? (
          <Text isLoading={isLoading} numberOfLines={4}>
            {text}
          </Text>
        ) : null}
      </Content>
    </CardWrapper>
  )
);

HorizontalPrayerRequestCard.propTypes = {
  text: PropTypes.string,
  requestedDate: PropTypes.string,
};

HorizontalPrayerRequestCard.displayName = 'HorizontalPrayerRequestCard';
HorizontalPrayerRequestCard.cardWidth = CARD_WIDTH;

export default HorizontalPrayerRequestCard;
