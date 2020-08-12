import React from 'react';
import { presentEventCreatingDialog } from 'react-native-add-calendar-event';
import PropTypes from 'prop-types';
import moment from 'moment';

import { styled, Button } from '@apollosproject/ui-kit';

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

// const handleAddToCalNew = async () => {
//   await RNCalendarEvents.checkPermissions();
//   await RNCalendarEvents.requestPermissions();
//   await RNCalendarEvents.saveEvent('Title of event', {
//     startDate: '2020-08-19T19:26:00.000Z',
//     endDate: '2020-08-19T19:35:00.000Z',
//   });
// };

const StyledButton = styled(({ theme }) => {})(Button);

const AddCalEventButton = ({
  buttonText,
  eventTitle,
  eventStart,
  eventNotes,
  isLoading,
  disabled,
}) => (
  <>
    <StyledButton
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onPress={() => {
        addToCalendar(eventTitle, eventNotes, eventStart);
      }}
      title={buttonText}
    />
    {/* <StyledButton
      disabled={disabled || isLoading}
      isLoading={isLoading}
      title={'Request auth'}
      onPress={() => {
        RNCalendarEvents.requestPermissions().then(
          (result) => {
            console.warn('Auth requested', result);
          },
          (result) => {
            console.error(result);
          }
        );
      }}
    />
    <StyledButton
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onPress={() => {
        RNCalendarEvents.saveEvent('Title of event', {
          startDate: '2020-08-03T19:26:00.000Z',
          endDate: '2020-08-03T19:35:00.000Z',
        }).then(
          (result) => {
            console.warn('saveEvent', result);
          },
          (result) => {
            console.error(result);
          }
        );
      }}
      title={'saveEvent'}
    />
    <StyledButton
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onPress={() => {
        RNCalendarEvents.checkPermissions().then(
          (result) => {
            console.warn('Auth check', result);
          },
          (result) => {
            console.error(result);
          }
        );
      }}
      title={'Check auth'}
    /> */}
  </>
);

AddCalEventButton.propTypes = {
  buttonText: PropTypes.string,
  eventTitle: PropTypes.string,
  eventStart: PropTypes.string,
  eventNotes: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

AddCalEventButton.defaultProps = {
  buttonText: 'Add to calendar',
};

export default AddCalEventButton;
