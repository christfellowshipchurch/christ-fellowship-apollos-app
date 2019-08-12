import React from 'react'
import { View, Text } from 'react-native'
import { get } from 'lodash'
import { Query, Mutation } from 'react-apollo'
import {
    PaddedView,
    TableView,
    styled,
    H3
} from '@apollosproject/ui-kit'

import UserAvatarHeader from 'ChristFellowship/src/ui/UserAvatarHeader'
import MilestoneForm from './MilstonesForm'

const RowHeader = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.sizing.baseUnit,
}))(PaddedView)

const Container = styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit,
}))(View)

const Name = styled({
    flexGrow: 1,
})(View)

const FaithMilestones = ({
    navigation,
    salvationRowTitle = 'I got saved on:',
    baptismRowTitle = 'I got baptized on:',
    prayerRequestRowTitle = 'Want some prayer?',
    prayerRequestRowDescription = 'Submit a Prayer Request'
}) => (
        <UserAvatarHeader
            navigation={navigation}
            minimize
            withGoBack >
            {({ salvationDate, baptismDate }) => {
                console.log({ salvationDate, baptismDate })
                return (
                    <Container>
                        <TableView>
                            <MilestoneForm
                                salvationRowTitle={salvationRowTitle}
                                baptismRowTitle={baptismRowTitle}
                                initialValues={{ salvationDate, baptismDate }}
                                onSubmit={async (variables, { setSubmitting, setFieldError }) => {
                                    try {
                                        await updatePassword({ variables })
                                    } catch (e) {
                                        const { graphQLErrors } = e
                                        if (graphQLErrors && graphQLErrors.length) {
                                            setFieldError(
                                                'confirmPassword',
                                                'Unknown error. Please try again later.'
                                            )
                                        }
                                    }
                                    setSubmitting(false)
                                }} />
                        </TableView>

                        <RowHeader>
                            <H3>{prayerRequestRowTitle}</H3>
                        </RowHeader>
                        <TableView>
                            <PaddedView>
                                <Text>{prayerRequestRowDescription}</Text>
                            </PaddedView>
                        </TableView>

                        <View style={{ height: 1000 }}>
                            <RowHeader>
                                <Name>
                                    <Text>Scroll up and down to see the Profile resize in real time</Text>
                                </Name>
                            </RowHeader>
                        </View>
                    </Container>
                )
            }}
        </UserAvatarHeader>
    )

export default FaithMilestones
