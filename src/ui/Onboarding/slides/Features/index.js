import React, { memo } from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';

import { styled, H2, H5, PaddedView } from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H5);

const StyledImage = styled(({ theme }) => ({
  flex: 3,
  resizeMode: 'contain',
  marginBottom: theme.sizing.baseUnit,
}))(Image);

const Content = styled({
  flex: 1,
  justifyContent: 'center',
})(View);

const TextContent = styled({
  flex: 1,
  justifyContent: 'center',
})(PaddedView);

// eslint-disable-next-line react/display-name
const Features = memo(({ firstName, description, imgSrc, ...props }) => (
  <Slide {...props}>
    <Content>
      {imgSrc ? <StyledImage source={imgSrc} /> : null}
      <TextContent>
        <Title>{`Hey ${firstName}!`}</Title>
        <StyledH5>{description}</StyledH5>
      </TextContent>
    </Content>
  </Slide>
));

Features.propTypes = {
  /* The `Swiper` component used in `<onBoarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  firstName: PropTypes.string,
  description: PropTypes.string,
  imgSrc: PropTypes.string,
};

Features.defaultProps = {
  firstName: 'friend',
  description:
    "We'd like to help personalize your mobile experience so we can help you with every step on your journey.",
};

export default Features;
