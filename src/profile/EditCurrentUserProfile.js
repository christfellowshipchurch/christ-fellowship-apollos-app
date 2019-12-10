import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { withNavigation } from 'react-navigation'
import { get, keys, upperFirst } from 'lodash'
import moment from 'moment'

import {
    ActivityIndicator,
} from '@apollosproject/ui-kit'

import UserProfile from './UserProfile'
import ProfileHeader from './ProfileHeader'
import EditUserProfile from './EditUserProfile'

import { CURRENT_USER } from './queries'
import { UPDATE_CURRENT_USER } from './mutations'

const EditCurrentUserProfile = ({
    navigation
}) => {
    const [values, setValues] = useState({})
    const {
        loading,
        error,
        refetch,
        data: {
            currentUser: {
                profile: {
                    firstName,
                    lastName,
                    photo,
                    campus,
                    address,
                    gender,
                    birthDate,
                } = {},
            } = {},
            getStatesList
        } = {}
    } = useQuery(
        CURRENT_USER,
        {
            fetchPolicy: "cache-and-network",
            onCompleted: ({
                currentUser: {
                    profile: { address, gender, birthDate, } = {},
                } = {},
            } = {}) => setValues({ birthDate, gender, ...address })
        }
    )
    const [updateProfile] = useMutation(UPDATE_CURRENT_USER)

    if (loading) return <ActivityIndicator />
    if (error) return null

    return <ProfileHeader
        firstName={firstName}
        lastName={lastName}
        avatar={photo}
        featuredImage={campus.featuredImage}
        campus={campus.name}
        edit
        onCancel={() => navigation.navigate('Connect')}
        onSave={() => {
            const valueKeys = keys(values)
            const input = valueKeys.map(n => ({ field: upperFirst(n), value: values[n] }))

            console.log({ input })
            navigation.navigate('Connect')
        }}
    >
        <EditUserProfile
            birthDate={birthDate}
            street1={address.street1}
            street2={address.street2}
            city={address.city}
            state={address.state}
            postalCode={address.postalCode}
            gender={gender}
            states={get(getStatesList, 'values', [])}
            campus={campus.name}
        />
    </ProfileHeader>
}

EditCurrentUserProfile.navigationOptions = {
    header: null
}

export default withNavigation(EditCurrentUserProfile)