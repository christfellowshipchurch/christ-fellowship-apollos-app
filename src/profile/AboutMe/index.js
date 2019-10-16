import React from 'react'
import { View, Text } from 'react-native'
import { get } from 'lodash'
import { Query, Mutation } from 'react-apollo'
import {
    PaddedView,
    TableView,
    Cell,
    CellIcon,
    CellText,
    Divider,
    Touchable,
    styled,
    H3
} from '@apollosproject/ui-kit'

import UserAvatarHeader from 'ChristFellowship/src/ui/UserAvatarHeader'
import { FormCard } from 'ChristFellowship/src/ui/Cards'
import InfoForm from './InfoForm'
import AddressForm from './AddressForm'

const RowHeader = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.sizing.baseUnit,
}))(PaddedView)

const AboutMeContainer = styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit,
}))(View)

const AboutMe = ({
    navigation,
    infoRowTitle = 'Personal Information',
    addressRowTitle = 'Home Address',
    changeNameRowTitle = 'Change Your Name',
    changeNameDescription = 'In order to change your name blah bloo blee sdfoinsadov deebidy derp'
}) => (
        <UserAvatarHeader
            navigation={navigation}
            minimize
            withGoBack >
            {({ birthDate, gender, address, ethnicity }) => {
                return (
                    <AboutMeContainer>
                        <InfoForm
                            initialValues={{ gender, birthDate, ethnicity }}
                            isInitialValid={() =>
                                !!(['Male', 'Female'].includes(gender) || birthDate)
                            }
                            title={infoRowTitle} />

                        <AddressForm initialValues={{ ...address }} title={addressRowTitle} />

                        <FormCard title={changeNameRowTitle}>
                            <Text>{changeNameDescription}</Text>
                        </FormCard>
                    </AboutMeContainer>
                )
            }}
        </UserAvatarHeader>
    )

export default AboutMe
