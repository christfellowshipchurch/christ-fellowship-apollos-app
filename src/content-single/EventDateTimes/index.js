import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import { BodyText, Icon, styled, withTheme } from '@apollosproject/ui-kit';

const Row = styled(({ theme, fontWeight }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const StyledText = styled(({ theme, fontWeight }) => ({
  fontSize: 20,
  fontWeight,
  marginLeft: theme.sizing.baseUnit * 0.5,
}))(BodyText);

const StyledIcon = withTheme(({ theme }) => ({
  size: 20,
  fill: theme.colors.text.tertiary,
}))(Icon);

const TextIconRow = ({ icon, fontWeight, children }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }}
  >
    <StyledIcon name={icon} />
    <StyledText style={{ fontWeight }}>{children}</StyledText>
  </View>
);

const DateTime = ({ start }) => {
  const mDate = moment(start);

  return (
    <Row>
      <TextIconRow icon="calendar" fontSize={20} fontWeight="bold">
        {mDate.format('ddd MMM D')}
      </TextIconRow>
      <TextIconRow icon="clock" fontSize={20}>
        {mDate.format('LT')}
      </TextIconRow>
    </Row>
  );
};

const EventDateTimes = ({ events, loading }) => {
  if (loading || events.length === 0) return null;

  return (
    <Row>
      {events
        .sort((a, b) => moment(a.start).diff(moment(b.start)))
        .map((event, i) => (
          <DateTime key={`EventDateTime:${i}`} {...event} />
        ))}
    </Row>
  );
};

EventDateTimes.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};

EventDateTimes.defaultProps = {
  events: [],
  loading: false,
};

export default EventDateTimes;
