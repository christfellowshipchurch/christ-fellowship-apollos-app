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
import SpouseForm from './SpouseForm'
import ChildrenForm from './ChildrenForm'

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
    spouseRowTitle = 'My Spouse',
    childrenRowTitle = 'My Children',
}) => (
        <UserAvatarHeader
            navigation={navigation}
            minimize
            withGoBack >
            {() => (
                <Container>
                    <RowHeader>
                        <H3>{spouseRowTitle}</H3>
                    </RowHeader>
                    <TableView>
                        <SpouseForm />
                    </TableView>

                    <RowHeader>
                        <H3>{childrenRowTitle}</H3>
                    </RowHeader>
                    <TableView>
                        <ChildrenForm />
                    </TableView>
                </Container>
            )}
        </UserAvatarHeader>
    )

export default FaithMilestones
