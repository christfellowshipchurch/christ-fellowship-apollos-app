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
                    <SpouseForm title={spouseRowTitle} />

                    <ChildrenForm title={childrenRowTitle} />
                </Container>
            )}
        </UserAvatarHeader>
    )

export default FaithMilestones
