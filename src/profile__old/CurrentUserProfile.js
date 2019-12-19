import React from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { get } from 'lodash'
import moment from 'moment'

import {
    ActivityIndicator,
} from '@apollosproject/ui-kit'

import UserProfile from './UserProfile'

import { CURRENT_USER } from './queries'
import { UPDATE_CURRENT_USER } from './mutations'

const CurrentUserProfile = () => {
    const {
        loading,
        error,
        refetch,
        data: {
            currentUser: {
                profile,
            } = {},
            getStatesList
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
        onSave={(fields) => {
            // updateProfile()
        }}
        states={get(getStatesList, 'values', [])}
    />
}

export default CurrentUserProfile