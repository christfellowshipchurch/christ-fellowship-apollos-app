import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { Touchable, Icon, withTheme } from '@apollosproject/ui-kit';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import share from '../../utils/content/share';

const enhance = compose(
  pure,
  withTheme()
);

const ShareContentButton = enhance(({ content, theme }) => (
  <AnalyticsConsumer>
    {({ track }) => {
      const onPress = () => {
        share(content);
        track({
          eventName: 'Share',
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

ShareContentButton.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    id: PropTypes.string,
  }),
};

export default ShareContentButton;
