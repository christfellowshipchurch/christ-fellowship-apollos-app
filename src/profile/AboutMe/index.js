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

const Name = styled({
    flexGrow: 1,
})(View)

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
            {({ birthDate, gender, address }) => {
                console.log({ birthDate, gender, address })

                return (
                    <AboutMeContainer>
                        <RowHeader>
                            <H3>{infoRowTitle}</H3>
                        </RowHeader>
                        <TableView>
                            <InfoForm
                                initialValues={{ gender, birthDate }}
                                isInitialValid={() =>
                                    !!(['Male', 'Female'].includes(gender) || birthDate)
                                }
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
                            <H3>{addressRowTitle}</H3>
                        </RowHeader>
                        <TableView>
                            <AddressForm initialValues={{ ...address }} />
                        </TableView>

                        <RowHeader>
                            <H3>{changeNameRowTitle}</H3>
                        </RowHeader>
                        <TableView>
                            <PaddedView>
                                <Text>{changeNameDescription}</Text>
                            </PaddedView>
                        </TableView>

                        <RowHeader>
                            <H3>{changeNameRowTitle}</H3>
                        </RowHeader>
                        <TableView>
                            <PaddedView>
                                <Text>{changeNameDescription}</Text>
                            </PaddedView>
                        </TableView>

                        <View style={{ height: 1000 }}>
                            <RowHeader>
                                <Name>
                                    <Text>Scroll up and down to see the Profile resize in real time</Text>
                                </Name>
                            </RowHeader>
                        </View>
                    </AboutMeContainer>
                )
            }}
        </UserAvatarHeader>
    )

export default AboutMe
