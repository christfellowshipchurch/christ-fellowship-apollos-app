import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import share from 'ChristFellowship/src/utils/content/share';
import { Touchable, Icon, withTheme } from '@apollosproject/ui-kit';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';

const enhance = compose(
  pure,
  withTheme()
);

const Share = enhance(({ content, theme }) => (
  <AnalyticsConsumer>
    {({ track }) => {
      const onPress = () => {
        share(content);
        track({
          eventName: 'ShareContent',
          properties: { id: content.id, title: content.title },
        });
      };
      return (
        <Touchable onPress={onPress}>
          <Icon name={'share'} fill={theme.colors.secondary} />
        </Touchable>
      );
    }}
  </AnalyticsConsumer>
));

Share.propTypes = {
  content: PropTypes.shape({
    message: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default Share;
