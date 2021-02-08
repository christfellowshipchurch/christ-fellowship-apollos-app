import React from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';
import {
  Card,
  CardContent,
  H5,
  styled,
  withIsLoading,
  ConnectedImage,
} from '@apollosproject/ui-kit';

import DateLabel from '../../DateLabel';

const CARD_WIDTH = 240;

const CardWrapper = styled(({ theme }) => ({
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

const SpacedRow = styled(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
}))(View);

const RequestorAvatar = styled(({ theme }) => ({
  width: 30,
  height: 30,
  borderRadius: 30,
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(ConnectedImage);

const HorizontalPrayerRequestCard = withIsLoading(
  ({ text, requestedDate, isLoading, requestor }) => (
    <CardWrapper isLoading={isLoading} inHorizontalList>
      <Content>
        <SpacedRow>
          {requestedDate ? (
            <StyledDateLabel date={requestedDate} isLoading={isLoading} />
          ) : null}
          <RequestorAvatar
            isLoading={!requestor?.photo?.uri && isLoading}
            source={requestor?.photo?.uri}
            // Sets the ratio of the image
            minAspectRatio={1}
            maxAspectRatio={1}
            // Sets the ratio of the placeholder
            forceRatio={1}
            // No ratios are respected without this
            maintainAspectRatio
          />
        </SpacedRow>

        {text ? (
          <Text isLoading={isLoading} numberOfLines={3}>
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
