import React from 'react'
import { View, Text } from 'react-native'
import {
    styled,
} from '@apollosproject/ui-kit'

import UserAvatarHeader from 'ChristFellowship/src/ui/UserAvatarHeader'
import { FormCard } from 'ChristFellowship/src/ui/Cards'
import MilestoneForm from './MilstonesForm'

const Container = styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit,
}))(View)

const FaithMilestones = ({
    navigation,
    prayerRequestRowTitle = 'Want some prayer?',
    prayerRequestRowDescription = 'Submit a Prayer Request'
}) => (
        <UserAvatarHeader
            navigation={navigation}
            minimize
            withGoBack >
            {({ salvationDate, baptismDate }) => (
                <Container>
                    <MilestoneForm initialValues={{ salvationDate, baptismDate }} />

                    <FormCard title={prayerRequestRowTitle}>
                        <Text>{prayerRequestRowDescription}</Text>
                    </FormCard>
                </Container>
            )}
        </UserAvatarHeader>
    )

export default FaithMilestones
