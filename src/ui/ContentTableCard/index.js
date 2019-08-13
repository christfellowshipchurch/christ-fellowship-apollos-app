import React, { PureComponent } from 'react';
// import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  TableView,
  Card,
  CardContent,
  styled,
  withIsLoading,
} from '@apollosproject/ui-kit';

import ContentTableCardItem from './ContentTableCardItem';

const Header = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
}))(CardContent);

const Content = styled(() => ({
  borderBottomWidth: 0,
  borderTopWidth: 0,
}))(TableView);

class ContentTableCard extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    isLoading: PropTypes.bool, // eslint-disable-line
    content: PropTypes.array, // eslint-disable-line
    header: PropTypes.element,
  };

  handleOnPress = ({ action, relatedNode: { id } }) => {
    const { onPress } = this.props;

    if (action === 'READ_CONTENT') {
      onPress({ id });
    }
  };

  render() {
    const { isLoading, content, header: headerContent } = this.props;

    return (
      <Card>
        <Header>{headerContent}</Header>
        <Content>
          {content.map((item) => (
            <ContentTableCardItem
              isLoading={isLoading}
              key={item.id}
              id={item.id}
              onPress={() => this.handleOnPress(item)}
              label={item.subtitle || ''}
              title={item.title || ''}
              imageSource={item.image ? item.image.sources : ''}
            />
          ))}
        </Content>
      </Card>
    );
  }
}

export default withIsLoading(ContentTableCard);
