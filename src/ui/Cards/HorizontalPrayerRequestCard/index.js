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

const CARD_WIDTH = 212;

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
  color: theme.colors.darkPrimary,
}))(H5);

const StyledDateLabel = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(DateLabel);

const HorizontalPrayerRequestCard = withIsLoading(
  ({ text, date, isLoading }) => (
    <CardWrapper isLoading={isLoading} inHorizontalList>
      <Content>
        {date ? <StyledDateLabel date={date} isLoading={isLoading} /> : null}
        {text ? <Text isLoading={isLoading}>{text}</Text> : null}
      </Content>
    </CardWrapper>
  )
);

HorizontalPrayerRequestCard.propTypes = {
  text: PropTypes.string,
  date: PropTypes.string,
};

HorizontalPrayerRequestCard.displayName = 'HorizontalPrayerRequestCard';
HorizontalPrayerRequestCard.cardWidth = CARD_WIDTH;

export default HorizontalPrayerRequestCard;
