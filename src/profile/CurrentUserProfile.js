import React from 'react'
import { useQuery } from 'react-apollo'
import { values } from 'lodash'
import moment from 'moment'

import {
    ActivityIndicator,
} from '@apollosproject/ui-kit'

import UserProfile from './UserProfile'

import { CURRENT_USER } from './queries'

const CurrentUserProfile = () => {
    const {
        loading,
        error,
        data: {
            currentUser: {
                profile,
            } = {},
        } = {}
    } = useQuery(
        CURRENT_USER,
        { fetchPolicy: "cache-and-network" }
    )

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

    return <UserProfile
        {...profile}
        fields={profileFields}
    />
}

export default CurrentUserProfile