import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  FlexedView,
  Divider,
  Touchable,
  styled,
  H4
} from '@apollosproject/ui-kit'
import { TableView, Cell } from 'ChristFellowship/src/ui/TableView'

const PaddedRow = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  padding: theme.sizing.baseUnit
}))(FlexedView)

const RowLink = ({ title, icon, onPress }) => (
  <React.Fragment>
    <Touchable
      onPress={onPress}
    >
      <PaddedRow>
        <FontAwesomeIcon icon={['fal', icon]} size={24} />
        <H4 style={{ flex: 4, paddingLeft: 10 }}>{title}</H4>
        <FontAwesomeIcon icon={['fal', 'angle-right']} size={24} />
      </PaddedRow>
    </Touchable>
    <Divider />
  </React.Fragment>
)

const ActionTable = ({
  navigation
}) => (
    <TableView>
      <Cell
        title="Profile Information"
        icon="user"
        onPress={() => navigation.navigate('AboutMe')} />

      <Cell
        title="Family Information"
        icon="users"
        onPress={() => navigation.navigate('FamilyInformation')} />
      <Cell
        title="Communication Preferences"
        icon="envelope"
        onPress={() => navigation.navigate('CommunicationPreferences')} />
      <Cell
        title="My Faith Milestones"
        icon="bible"
        onPress={() => navigation.navigate('FaithMilestones')} />
      <Cell
        title="Privacy, Terms of Use, Feedback"
        icon="mobile"
        onPress={() => navigation.navigate('AppInformation')} />
    </TableView>
  )

export default ActionTable
