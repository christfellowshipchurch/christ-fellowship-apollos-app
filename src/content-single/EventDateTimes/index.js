import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { Picker as NativePicker } from 'react-native';
import {
  get,
  identity,
  uniq,
  flatMapDepth,
  groupBy,
  keys,
  indexOf,
} from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  FlexedView,
  H4,
  H5,
  H6,
  BodyText,
  Touchable,
} from '@apollosproject/ui-kit';
import PickerList from '@apollosproject/ui-kit/src/inputs/Picker/PickerList';

import {
  HorizontalLine,
  TextIconRow,
  ScheduleContainer,
  CampusContainer,
  ContentContainer,
  DirectionsTouchable,
} from './components';
import { CURRENT_USER_CAMPUS } from './queries';

const EventTimes = ({ date, times }) => {
  const mDate = moment(date);
  const currentUtcOffset = moment().format('ZZ');

  return (
    <ScheduleContainer>
      <TextIconRow icon="calendar-alt" fontSize={20} fontWeight="bold">
        {mDate.format('ddd MMM D')}
      </TextIconRow>
      {times
        .sort((a, b) => moment(a.start).diff(moment(b.start)))
        .map((t, i) => {
          const utc = moment.utc(t.start);
          const local = moment(utc).utcOffset(currentUtcOffset);

          return (
            <TextIconRow key={`EventTimesTime:${i}`} icon="clock" fontSize={20}>
              {local.format('LT')}
            </TextIconRow>
          );
        })}
    </ScheduleContainer>
  );
};

const CampusSelection = ({ loading, campuses, onChange, defaultCampus }) => {
  const [focused, setFocused] = useState(false);
  const selectLocation = 'Select Location';
  const options = [selectLocation, ...campuses];
  const [selected, setSelected] = useState(
    options.includes(defaultCampus) ? defaultCampus : options[0]
  );

  // when the selection changes, call the onChange method
  useEffect(() => onChange(selected), [selected]);

  if (!loading && campuses.length === 0)
    return (
      <BodyText style={{ fontStyle: 'italic' }}>
        Check back soon for dates and times
      </BodyText>
    );

  return (
    <Touchable onPress={() => setFocused(!focused)}>
      <CampusContainer>
        <H4 isLoading={loading}>{selected}</H4>

        {!loading && <H6>{selected !== selectLocation && 'Change'}</H6>}

        <PickerList
          selectedValue={indexOf(options, selected)}
          // Sets the value of the Picker locally,
          //    but without triggering the callback func
          onValueChange={(key) => {
            const index = parseInt(key, 10);
            setSelected(options[index]);
          }}
          // When the user manually presses the DONE button,
          //    we fire the callback function with the new value
          onRequestClose={() => {
            setFocused(false);
            onChange(selected);
          }}
          focused={focused}
        >
          {options.map((o, i) => (
            <NativePicker.Item key={i} label={o} value={i} />
          ))}
        </PickerList>
      </CampusContainer>
    </Touchable>
  );
};

const EventOcurrences = ({ defaultCampus, events, loading }) => {
  const [visibleOccurrences, setVisibleOccurrences] = useState([]);
  const campusOptions = uniq(
    flatMapDepth(events.map((e) => e.campuses.map((c) => c.name)), identity, 2)
  );
  const groupByLocations = groupBy(visibleOccurrences, 'location');
  const groupByLocationDate = keys(groupByLocations).map((l) => {
    const dateTimes = groupBy(groupByLocations[l], (o) =>
      moment(o.start).format('YYYY-MM-DD')
    );

    return { location: l, dateTimes };
  });

  const onChange = (campus) => {
    const campusEvents = events.filter((e) =>
      e.campuses.find((c) => c.name === campus)
    );

    setVisibleOccurrences(campusEvents);
  };

  if (loading) return null;

  return (
    <ContentContainer>
      <CampusSelection
        campuses={campusOptions}
        loading={loading}
        onChange={onChange}
        defaultCampus={defaultCampus}
      />

      {groupByLocationDate.map((event, i) => {
        const { location, dateTimes } = event;
        return (
          <FlexedView
            key={`Event:${location}${i}`}
            style={{ flexDirection: 'column' }}
          >
            {keys(dateTimes).map((date) => (
              <EventTimes
                key={`EventOccurenceDate:${date}`}
                date={date}
                times={dateTimes[date]}
              />
            ))}

            {!!location &&
              location !== '' && (
                <DirectionsTouchable location={location}>
                  <H5>{location}</H5>
                </DirectionsTouchable>
              )}

            <HorizontalLine />
          </FlexedView>
        );
      })}
    </ContentContainer>
  );
};

EventOcurrences.propTypes = {
  events: PropTypes.array,
  defaultCampus: PropTypes.string,
  loading: PropTypes.bool,
};

EventOcurrences.defaultProps = {
  events: [],
};

const WithDefaultCampus = ({ events }) => {
  const { loading, error, data } = useQuery(CURRENT_USER_CAMPUS);
  const currentUserCampus = get(data, 'currentUser.profile.campus.name', '');

  return (
    <EventOcurrences
      events={events}
      defaultCampus={currentUserCampus}
      loading={loading}
    />
  );
};

WithDefaultCampus.propTypes = {
  events: PropTypes.array,
};

export default WithDefaultCampus;
