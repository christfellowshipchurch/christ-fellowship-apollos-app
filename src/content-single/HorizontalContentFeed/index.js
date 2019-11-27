import React, { Component } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { Query } from 'react-apollo';

import {
  styled,
  H3,
  CardTile,
  HorizontalTileFeed,
  TouchableScale,
  HighlightCard,
} from '@apollosproject/ui-kit';

import { TinyCard } from 'ChristFellowship/src/ui/Cards'

import GET_HORIZONTAL_CONTENT from './getHorizontalContent';

const loadingStateObject = {
  node: {
    id: 'fakeId0',
    title: '',
    isLoading: true,
  },
};

const Title = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit
}))(H3)

class HorizontalContentFeed extends Component {
  static propTypes = {
    contentId: PropTypes.string,
    navigation: PropTypes.shape({
      push: PropTypes.func,
    }),
  };

  handleOnPressItem = (item) => {
    this.props.navigation.push('ContentSingle', {
      itemId: item.id,
    });
  };

  renderItem = ({ item, index, ...cardProps }) => (
    <TouchableScale onPress={() => this.handleOnPressItem(item)}>
      <TinyCard
        number={index + 1}
        title={get(item, 'title', '')}
        {...cardProps}
        coverImage={get(item, 'coverImage.sources', [])}
      /*
       * These are props that are not yet being passed in the data.
       * We will need to make sure they get added back when that data is available.
       * byLine={item.content.speaker}
       * date={item.meta.date}
       */
      />
    </TouchableScale>
  );

  renderFeed = ({ data, loading, error }) => {
    if (error) return null;
    if (loading) return null;

    const childContent = get(
      data,
      'node.childContentItemsConnection.edges',
      []
    ).map((edge) => edge.node);

    const siblingContent = get(
      data,
      'node.siblingContentItemsConnection.edges',
      []
    ).map((edge) => edge.node);

    const content = siblingContent.length ? siblingContent : childContent;

    return content && content.length ? ([
      <Title key={`HorizontalContentFeed:Title`}>
        Related Items
      </Title>,
      <HorizontalTileFeed
        key={`HorizontalContentFeed:Content`}
        content={content}
        loadingStateObject={loadingStateObject}
        renderItem={this.renderItem}
      />
    ]) : null;
  };

  render() {
    if (!this.props.contentId) return this.renderFeed({ loading: true });

    return (
      <Query
        query={GET_HORIZONTAL_CONTENT}
        variables={{ itemId: this.props.contentId }}
      >
        {this.renderFeed}
      </Query>
    );
  }
}

export default withNavigation(HorizontalContentFeed);
