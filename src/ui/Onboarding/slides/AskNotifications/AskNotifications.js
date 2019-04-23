import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {
  PaddedView,
  FlexedView,
  styled,
  H2,
  H5,
  Button,
} from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const ContentWrapper = styled({
  height: '100%',
})(View);

const Content = styled({
  justifyContent: 'flex-end',
})(PaddedView);

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
  paddingBottom: theme.sizing.baseUnit * 1.5,
}))(H5);

// memo = sfc PureComponent 💥
// eslint-disable-next-line react/display-name
const AskNotifications = memo(
  ({
    children,
    slideTitle,
    description,
    buttonText,
    buttonDisabled,
    onPressButton,
    ...props
  }) => (
    <Slide {...props}>
      <ContentWrapper>
        <FlexedView>{children}</FlexedView>
        <Content>
          <Title>{slideTitle}</Title>
          <StyledH5>{description}</StyledH5>
          {buttonDisabled || onPressButton ? (
            <Button
              title={buttonText}
              onPress={onPressButton}
              disabled={buttonDisabled}
              pill={false}
            />
          ) : null}
        </Content>
      </ContentWrapper>
    </Slide>
  )
);

AskNotifications.propTypes = {
  /* The `Swiper` component used in `<onBoarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use a more unique name.
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonDisabled: PropTypes.bool,
  onPressButton: PropTypes.func,
};

AskNotifications.defaultProps = {
  slideTitle: 'Can we keep you informed?',
  description:
    "We'll let you know when important things are happening and keep you in the loop",
  buttonText: 'Yes, enable notifications',
  buttonDisabled: false,
};

export default AskNotifications;
