import React from 'react';
import { presentEventCreatingDialog } from 'react-native-add-calendar-event';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  Button,
  BodySmall,
  Icon,
  withTheme,
  styled,
} from '@apollosproject/ui-kit';

const StyledButton = withTheme(({ theme }) => ({
  style: {
    alignSelf: 'flex-end',
    height: theme.sizing.baseUnit * 2,
  },
}))(Button);

const StyledIcon = styled(({ theme }) => ({
  marginRight: theme.sizing.baseUnit * 0.5,
}))(Icon);

const utcDateToString = (momentInUTC) => {
  const s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  // console.warn(s);
  return s;
};

const addToCalendar = (title, notes, startDateUTC) => {
  const eventConfig = {
    title,
    startDate: utcDateToString(startDateUTC),
    endDate: utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
    notes,
    alert: 15,
  };

  presentEventCreatingDialog(eventConfig)
    .then((eventInfo) => {
      // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
      // These are two different identifiers on iOS.
      // On Android, where they are both equal and represent the event id, also strings.
      // when { action: 'CANCELED' } is returned, the dialog was dismissed
      console.warn(JSON.stringify(eventInfo));
    })
    .catch((error) => {
      // handle error such as when user rejected permissions
      console.warn(error);
    });
};

const AddCalEventButton = ({
  eventTitle,
  eventStart,
  eventNotes,
  isLoading,
  disabled,
}) => (
  <StyledButton
    disabled={disabled || isLoading}
    isLoading={isLoading}
    onPress={() => {
      addToCalendar(eventTitle, eventNotes, eventStart);
    }}
    bordered
    type={'primary'}
  >
    <StyledIcon name="calendar-add" size={14} />
    <BodySmall>Add to Calendar</BodySmall>
  </StyledButton>
);

AddCalEventButton.propTypes = {
  eventTitle: PropTypes.string,
  eventStart: PropTypes.string,
  eventNotes: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default AddCalEventButton;
