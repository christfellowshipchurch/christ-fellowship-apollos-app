import React from 'react';
import { View } from 'react-native';

import {
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
  PaddedView,
  H4,
} from '@apollosproject/ui-kit';
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser';
import NavigationActions from 'ChristFellowship/src/NavigationService';

const RowLink = ({ title, icon, link = 'https://beta.christfellowship.church' }) => (
  <React.Fragment>
    <Touchable
      onPress={() => openUrl(link)}
    >
      <Cell>
        <CellIcon name={icon} />
        <CellText>{title}</CellText>
      </Cell>
    </Touchable>
    <Divider />
  </React.Fragment>
)

const Name = styled({
  flexGrow: 1,
})(View);

const ActionTable = () => (
  <WebBrowserConsumer>
    {(openUrl) => (
      <TableView>
        <RowLink title="Profile Information" icon="profile" />
        <RowLink title="Family Information" icon="groups" />
        <RowLink title="Communication Preferences" icon="avatar" />
        <RowLink title="My Faith Milestones" icon="pray" />
        <RowLink title="Privacy, Terms of Use, Feedback" icon="information" />
      </TableView>
    )}
  </WebBrowserConsumer>
);

const StyledActionTable = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 100,
}))(ActionTable);

export default StyledActionTable;
