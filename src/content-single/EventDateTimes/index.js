import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import { BodyText, Icon, styled, withTheme } from '@apollosproject/ui-kit';
import AddCalEventButton from '../AddCalEventButton';

const Container = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(View);

const Row = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.sizing.baseUnit,
}))(View);

const Cell = styled({
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'nowrap',
})(View);

const StyledText = styled(({ theme, fontWeight }) => ({
  fontSize: 20,
  fontWeight,
  marginLeft: theme.sizing.baseUnit * 0.5,
}))(BodyText);

const StyledIcon = withTheme(({ theme }) => ({
  size: 20,
  fill: theme.colors.text.tertiary,
}))(Icon);

const DateTime = ({ title, summary, start }) => {
  const mDate = moment(start);

  return (
    <Row>
      <Cell>
        <StyledIcon name={'calendar'} />
        <StyledText fontWeight={'bold'}>{mDate.format('ddd MMM D')}</StyledText>
        <StyledText>{mDate.format('LT')}</StyledText>
      </Cell>
      <AddCalEventButton
        eventNotes={summary}
        eventStart={start}
        eventTitle={title}
        buttonLabel={'Add'}
        size={24}
      />
    </Row>
  );
};

const EventDateTimes = ({ content, events, loading }) => {
  if (loading || events.length === 0) return null;

  return (
    <Container>
      {events
        .sort((a, b) => moment(a.start).diff(moment(b.start)))
        .map((event) => (
          <DateTime key={event.start} {...content} {...event} />
        ))}
    </Container>
  );
};

EventDateTimes.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    summary: PropTypes.string,
  }),
  events: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};

EventDateTimes.defaultProps = {
  events: [],
  loading: false,
};

export default EventDateTimes;
