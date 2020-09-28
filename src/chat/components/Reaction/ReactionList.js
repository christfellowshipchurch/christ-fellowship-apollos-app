import React from 'react';
import { Text } from 'react-native';
import styled from '@stream-io/styled-components';
import PropTypes from 'prop-types';

import { themed } from '../../styles/theme';
import { renderReactions, emojiData } from '../../utils';

const TouchableWrapper = styled.View`
  position: relative;
  ${({ alignment }) =>
    alignment === 'left' ? 'left: -10px;' : 'right: -10px;'} height: 28px;
  z-index: 10;
  align-self: ${({ alignment }) =>
    alignment === 'left' ? 'flex-start' : 'flex-end'};
`;

const Container = styled.View`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  z-index: 10;
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 1px;
  border-width: 0;
  background-color: black;
  border-radius: 30;
  ${({ theme }) => theme.message.reactionList.container.css};
`;

const PointyThing = styled.View`
  width: 10px;
  height: 10px;
  position: absolute;
  ${({ alignment }) =>
    alignment === 'left' ? 'left: 7px;' : 'right: 7px;'} bottom: 1px;
  background-color: black;
  transform: rotate(45deg);
  ${({ theme }) => theme.message.reactionList.container.css};
`;

const ReactionCount = styled(({ reactionCounts, ...rest }) => (
  <Text {...rest} />
))`
  color: white;
  font-size: 12;
  ${({ reactionCounts }) =>
    reactionCounts < 10 ? null : 'min-width: 20px;'} ${({ theme }) =>
    theme.message.reactionList.reactionCount.css};
`;

const Reactions = styled.View`
  flex-direction: row;
`;

/**
 * @example ../docs/ReactionList.md
 * @extends PureComponent
 */

class ReactionList extends React.PureComponent {
  static propTypes = {
    latestReactions: PropTypes.array,
    getTotalReactionCount: PropTypes.func,
    visible: PropTypes.bool,
    alignment: PropTypes.string,
    /**
     * e.g.,
     * [
     *  {
     *    id: 'like',
     *    icon: '👍',
     *  },
     *  {
     *    id: 'love',
     *    icon: '❤️️',
     *  },
     *  {
     *    id: 'haha',
     *    icon: '😂',
     *  },
     *  {
     *    id: 'wow',
     *    icon: '😮',
     *  },
     * ]
     */
    supportedReactions: PropTypes.array,
  };

  static defaultProps = {
    supportedReactions: emojiData,
  };

  static themePath = 'message.reactionList';

  render() {
    const {
      latestReactions,
      getTotalReactionCount,
      visible,
      alignment,
      supportedReactions,
    } = this.props;
    return (
      <TouchableWrapper alignment={alignment} activeOpacity={1}>
        <PointyThing alignment={alignment} />
        <Container visible={visible}>
          <Reactions>
            {renderReactions(latestReactions, supportedReactions)}
          </Reactions>
          <ReactionCount
            reactionCounts={getTotalReactionCount(supportedReactions)}
          >
            {getTotalReactionCount(supportedReactions)}
          </ReactionCount>
        </Container>
      </TouchableWrapper>
    );
  }
}

export default themed(ReactionList);
