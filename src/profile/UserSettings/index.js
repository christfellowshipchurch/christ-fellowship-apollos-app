import React from 'react'
import { get, has } from 'lodash'
import { useQuery, useMutation } from 'react-apollo'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  FlexedView,
  Touchable,
  ActivityIndicator,
  H4,
  withTheme
} from '@apollosproject/ui-kit'

import UserAvatarHeader from '../../ui/UserAvatarHeader'
import { FormCard } from '../../ui/Cards'
import { GET_LOGIN_STATE, LOGOUT } from '@apollosproject/ui-auth'
import GET_USER_LOGIN_TYPES from './getUserLoginTypes'
import ChangePassword from './ChangePassword'

const PaddedIcon = withTheme(({ theme, icon }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  icon: ['fal', icon],
  size: 24
}))(FontAwesomeIcon)

const LocationTitle = ({ title, onPress }) => (
  <Touchable
    onPress={onPress}
  >
    <FlexedView style={{ flexDirection: 'row' }}>
      <PaddedIcon icon='map-marker-alt' style={{ alignSelf: 'flex-start' }} />
      <H4 style={{ flex: 4 }}>{title}</H4>
      <PaddedIcon icon='angle-right' style={{ alignSelf: 'flex-end' }} />
    </FlexedView>
  </Touchable>
)

const ChangePasswordCard = () => {
  const { loading, error, data: { getUserLoginTypes } } = useQuery(GET_USER_LOGIN_TYPES, { fetchPolicy: "cache-and-network" })

  if (loading || error) return <ActivityIndicator />

  return has(getUserLoginTypes, 'email')
    ? (
      <FormCard title='Change My Password'>
        <ChangePassword />
      </FormCard>
    ) : null
}

const LogoutCard = () => {
  const [handleLogout] = useMutation(LOGOUT)

  return (
    <Touchable
      onPress={async () => {
        // trigger handle logout
        // rest of logout navigation and logic is handled on the Connect screen
        await handleLogout()
      }} >
      <FormCard>
        <FlexedView style={{ flexDirection: 'row' }}>
          <H4>Log Out</H4>
          <FontAwesomeIcon size={24} icon={['fal', 'angle-right']} style={{ alignSelf: 'flex-end' }} />
        </FlexedView>
      </FormCard>
    </Touchable>
  )
}

const UserSettings = ({
  navigation,
  title = 'Account Settings',
  campusRowTitle = 'My Home Campus',
}) => {
  const { loading, error, data: { isLoggedIn } } = useQuery(GET_LOGIN_STATE)

  if (loading) return <ActivityIndicator />
  if (!isLoggedIn || error) return null

  return (
    <UserAvatarHeader
      title={title}
      navigation={navigation}
      edit >
      {({ campus }) => (
        <React.Fragment>
          <FormCard title={campusRowTitle}>
            <LocationTitle
              title={get(campus, 'name', 'Select My Location')}
              onPress={() => navigation.navigate('Location')} />
            {/* onPress={() => { }} /> */}
          </FormCard>

          <ChangePasswordCard />

          <LogoutCard />
        </React.Fragment>
      )}
    </UserAvatarHeader>
  )
}

export default UserSettings
