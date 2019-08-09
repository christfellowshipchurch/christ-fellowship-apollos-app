import React from 'react'
import {
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
} from '@apollosproject/ui-kit'

const RowLink = ({ title, icon, onPress }) => (
  <React.Fragment>
    <Touchable
      onPress={onPress}
    >
      <Cell>
        <CellIcon name={icon} />
        <CellText>{title}</CellText>
        <CellIcon name={'arrow-next'} />
      </Cell>
    </Touchable>
    <Divider />
  </React.Fragment>
)

const ActionTable = ({
  navigation
}) => (
    <TableView>
      <RowLink
        title="Profile Information"
        icon="profile"
        onPress={() => navigation.navigate('AboutMe')} />
      <RowLink title="Family Information" icon="groups" />
      <RowLink title="Communication Preferences" icon="avatar" />
      <RowLink title="My Faith Milestones" icon="pray" />
      <RowLink title="Privacy, Terms of Use, Feedback" icon="information" />
    </TableView>
  )

const StyledActionTable = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 100,
}))(ActionTable)

export default StyledActionTable
