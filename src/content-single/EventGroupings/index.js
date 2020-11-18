import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get } from 'lodash';

import {
  BodyText,
  Icon,
  styled,
  withTheme,
  H4,
  Picker,
} from '@apollosproject/ui-kit';
import { PickerItem } from 'ui/inputs';
import DateLabel from 'ui/DateLabel';

import GET_EVENT_GROUPINGS from './getEventGroupings';

const StyledPicker = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 0.5,
  color: theme.colors.text.primary,
  ...Platform.select({
    android: {
      fontFamily: theme.typography.sans.bold.default,
    },
  }),
  fontSize: 16,
}))(Picker);

const Row = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const StyledText = styled(({ theme, fontWeight = 'bold' }) => ({
  fontSize: 20,
  fontWeight,
  marginLeft: theme.sizing.baseUnit * 0.5,
}))(BodyText);

const StyledIcon = withTheme(({ theme }) => ({
  size: 20,
  fill: theme.colors.text.tertiary,
}))(Icon);

const TextIconRowLayout = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))(View);

const TextIconRow = ({ icon, children }) => (
  <TextIconRowLayout>
    <StyledIcon name={icon} />
    {children}
  </TextIconRowLayout>
);

TextIconRow.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.oneOf([
    PropTypes.element,
    PropTypes.func,
    PropTypes.array,
  ]),
};

const DateTime = ({ start }) => {
  const mDate = moment(start);

  return (
    <Row>
      <TextIconRow icon="calendar" fontSize={20}>
        <DateLabel date={start} Component={StyledText} />
      </TextIconRow>
      <TextIconRow icon="clock" fontSize={20}>
        <StyledText fontWeight="normal">{mDate.format('LT')}</StyledText>
      </TextIconRow>
    </Row>
  );
};

DateTime.propTypes = {
  start: PropTypes.string,
};

const EventGroupings = ({ groupings, defaultSelection }) => {
  const [selected, setSelected] = useState(
    defaultSelection || get(groupings, '[0].name')
  );
  const selectedGroup = groupings.find((i) => i.name === selected);

  return (
    <View>
      <StyledPicker
        label=""
        value={selected}
        displayValue={selected}
        onValueChange={(newSelection) => setSelected(newSelection)}
      >
        {groupings.map(({ name }) => (
          <PickerItem label={name} value={name} key={name} />
        ))}
      </StyledPicker>

      {get(selectedGroup, 'instances', []).map((item) => (
        <DateTime key={item.start} start={item.start} />
      ))}
    </View>
  );
};

EventGroupings.propTypes = {
  defaultSelection: PropTypes.string,
  groupings: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      instances: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          start: PropTypes.string,
          end: PropTypes.string,
        })
      ),
    })
  ),
};

EventGroupings.defaultProps = {
  groupings: [],
  defaultSelection: null,
};

const EventGroupingsConnected = ({ contentId }) => {
  const { data, loading, error } = useQuery(GET_EVENT_GROUPINGS, {
    variables: { id: contentId },
    skip: !contentId || contentId === '',
  });

  if (error) return null;
  if (loading) return <H4 isLoading>...loading</H4>;

  const groupings = get(data, 'node.eventGroupings', []);
  const myCampus = get(data, 'currentUser.profile.campus.name', '');
  const defaultSelection = groupings.filter((i) => i.name === myCampus).length
    ? myCampus
    : get(groupings, '[0].name');

  if (!groupings.length) return null;

  return (
    <EventGroupings
      groupings={get(data, 'node.eventGroupings', [])}
      defaultSelection={defaultSelection}
    />
  );
};

EventGroupingsConnected.propTypes = {
  contentId: PropTypes.string,
};

EventGroupingsConnected.defaultProps = {
  contentId: null,
};

export default EventGroupingsConnected;
