import React from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { get } from 'lodash'
import moment from 'moment'

import {
    ActivityIndicator,
} from '@apollosproject/ui-kit'

import UserProfile from './UserProfile'
import ProfileHeader from './ProfileHeader'
import EditUserProfile from './EditUserProfile'

import { CURRENT_USER } from './queries'
import { UPDATE_CURRENT_USER } from './mutations'

const CurrentUserProfile = () => {
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
        { fetchPolicy: "cache-and-network" }
    )
    const [updateProfile] = useMutation(UPDATE_CURRENT_USER)

    if (loading) return <ActivityIndicator />
    if (error) return null

    const address = [
        profile.address.street1,
        profile.address.street2,
        `${profile.address.city}, ${profile.address.state} ${profile.address.postalCode.substring(0, 5)}`
    ]

    const profileFields = [
        { title: 'Home Address', content: address },
        { title: 'Birthday', content: moment(profile.birthDate).format('MMM D, YYYY') },
        { title: 'Gender', content: profile.gender },
    ]

    return <ProfileHeader
        firstName={firstName}
        lastName={lastName}
        avatar={photo}
        featuredImage={campus.featuredImage}
        campus={campus.name}
        edit
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
        />
    </ProfileHeader>

    return <UserProfile
        {...profile}
        fields={profileFields}
        onSave={(fields) => {
            // updateProfile()
        }}
        states={get(getStatesList, 'values', [])}
    />
}

export default CurrentUserProfile