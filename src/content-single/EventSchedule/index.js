import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import {
  View,
  Platform,
  Linking,
  Picker as NativePicker
} from 'react-native'
import { get, find } from 'lodash'
import PropTypes from 'prop-types'
import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  styled,
  withTheme,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  FlexedView,
  H3,
  H5,
  BodyText,
  Touchable
} from '@apollosproject/ui-kit'
import PickerList from '@apollosproject/ui-kit/src/inputs/Picker/PickerList'

import { GET_EVENT_SCHEDULES } from './queries'

const parseSchedulesByCampus = (schedules = []) => {
  // Set an empty array for adding dates
  let parsed = []

  // Loop through each schedule and add new campus specific dates
  schedules.forEach(schedule => {
    const { campuses } = schedule
    const campusDates = campuses.map(campus => ({
      campus,
      dates: schedule.dates,
      location: schedule.location
    }))

    parsed = [...parsed, ...campusDates]
  })

  return parsed
}

const Icon = withTheme(({ theme, icon, size }) => ({
  icon,
  size,
  style: {
    marginRight: theme.sizing.baseUnit,
  }
}))(FontAwesomeIcon)

const TextIconRow = ({ icon, fontSize, fontWeight, children }) => (
  <FlexedView
    style={{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }}
  >
    <Icon icon={['fal', icon]} size={fontSize} />
    <BodyText style={{ fontWeight, fontSize }}>
      {children}
    </BodyText>
  </FlexedView>
)

const ScheduleContainer = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.75,
}))(View)

const ScheduleList = ({ dates }) => dates.map((n, i) => {
  const date = moment(n)

  return <ScheduleContainer key={i}>
    <TextIconRow
      key={`ScheduleListDate:${i}`}
      icon="calendar-alt"
      fontSize={20}
      fontWeight='bold'
    >
      {date.format('ddd MMM D')}
    </TextIconRow>
    <TextIconRow
      key={`ScheduleListTime:${i}`}
      icon="clock"
      fontSize={20}
    >
      {date.format('LT')}
    </TextIconRow>
  </ScheduleContainer>

})

const CampusContainer = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 1,
  marginBottom: theme.sizing.baseUnit * 1,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.lightSecondary
}))(View)

const CampusSelection = ({
  campus,
  loading,
  campuses,
  onChange
}) => {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState(campus)

  return (
    <Touchable
      onPress={() => setFocused(!focused)}
    >
      <CampusContainer>
        <H3 isLoading={loading}>
          {campus}
        </H3>
        <BodyText>
          Select Campus
        </BodyText>

        <PickerList
          selectedValue={value}
          // Sets the value of the Picker locally, 
          //    but without triggering the callback func
          onValueChange={(newValue) => setValue(newValue)}
          // When the user manually presses the DONE button,
          //    we fire the callback function with the new value
          onRequestClose={() => {
            setFocused(false)
            onChange(value)
          }}
          focused={focused}
        >
          <NativePicker.Item
            label={'Select a Campus'}
            value={''}
          />
          {campuses.map((n, i) =>
            <NativePicker.Item
              key={i}
              label={n.campus.name}
              value={n.campus.name}
            />
          )}
        </PickerList>
      </CampusContainer>
    </Touchable>
  )
}

const ContentContainer = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 1.5,
}))(View)

const DirectionsTouchable = withTheme(({ theme, location }) => ({
  onPress: Platform.select({
    ios: () => {
      Linking.openURL(`http://maps.apple.com/maps?daddr=${location}`)
    },
    android: () => {
      Linking.openURL(`http://maps.google.com/maps?daddr=${location}`)
    }
  }),
  style: {
    marginVertical: theme.sizing.baseUnit,
  }
}))(Touchable)

const EventSchedules = ({
  contentId
}) => {
  const [payload, setPayload] = useState({})
  const { loading, error, data } = useQuery(GET_EVENT_SCHEDULES,
    {
      variables: { id: contentId },
      onCompleted: (data) => {
        const defaultCampus = get(data, 'currentUser.profile.campus.name')
        const schedules = get(data, 'node.childContentItemsConnection.edges', [])
          .map(edge => edge.node)
        const schedulesByCampus = parseSchedulesByCampus(schedules)

        setPayload(find(schedulesByCampus, (n) => n.campus.name === defaultCampus))
      }
    }
  )

  // Map the children to a collection of content items
  const schedules = get(data, 'node.childContentItemsConnection.edges', [])
    .map(edge => edge.node)
  const schedulesByCampus = parseSchedulesByCampus(schedules)
  const location = get(payload, 'location', '')

  return (
    <ContentContainer>
      <CampusSelection
        campuses={schedulesByCampus}
        campus={get(payload, 'campus.name', '')}
        loading={loading}
        onChange={(campus) =>
          setPayload(find(schedulesByCampus, (n) => n.campus.name === campus))
        }
      />

      <ScheduleList dates={get(payload, 'dates', [])} />

      {!!location && location !== '' &&
        <DirectionsTouchable location={location}>
          <H5>
            {location}
          </H5>
        </DirectionsTouchable>}

    </ContentContainer>
  )
}

EventSchedules.propTypes = {
  contentId: PropTypes.string,
}

export default EventSchedules
