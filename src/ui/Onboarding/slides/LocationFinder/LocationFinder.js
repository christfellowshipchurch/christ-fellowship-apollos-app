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
  Touchable,
} from '@apollosproject/ui-kit';

import CampusCard from 'ChristFellowship/src/user-settings/Locations/CampusCard';
import Slide from '../../Slide';

const getCampusAddress = (campus) =>
  `${campus.street1}\n${campus.city}, ${campus.state} ${campus.postalCode}`;

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

const StyledCampusCard = styled(({ theme }) => ({
  marginHorizontal: theme.sizing.baseUnit,
  marginBottom: theme.sizing.baseUnit,
}))(CampusCard);

// memo = sfc PureComponent 💥
// eslint-disable-next-line react/display-name
const LocationFinder = memo(
  ({
    onPressPrimary,
    children,
    slideTitle,
    description,
    buttonText,
    buttonDisabled,
    onPressButton,
    isCurrentCampus,
    campus,
    ...props
  }) => (
    <Slide
      onPressPrimary={
        campus /* show the primary action button (next) if we have a campus */
          ? onPressPrimary
          : null
      }
      onPressSecondary={
        !campus /* show the secondary action button (skip) if we don't have a campus */
          ? onPressPrimary
          : null
      }
      {...props}
    >
      <ContentWrapper>
        <FlexedView>{children}</FlexedView>
        <Content>
          <Title>{slideTitle}</Title>
          <StyledH5>{description}</StyledH5>
        </Content>
        {campus ? (
          <Touchable onPress={onPressButton}>
            <StyledCampusCard
              key={campus.id}
              distance={campus.distanceFromLocation}
              title={campus.name}
              description={getCampusAddress(campus)}
              images={[campus.image]}
            />
          </Touchable>
        ) : (
          <Content>
            <Button
              title={buttonText}
              onPress={onPressButton}
              disabled={buttonDisabled}
              pill={false}
            />
          </Content>
        )}
      </ContentWrapper>
    </Slide>
  )
);

LocationFinder.propTypes = {
  /* The `Swiper` component used in `<Onboarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use a more unique name.
   */
  onPressPrimary: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonDisabled: PropTypes.bool,
  onPressButton: PropTypes.func,
  campus: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  isCurrentCampus: PropTypes.bool,
};

LocationFinder.defaultProps = {
  slideTitle: "Let's select your local campus",
  description:
    "We'll use your location to connect you with your nearby campus and community",
  buttonText: 'Yes, find my local campus',
  buttonDisabled: false,
};

export default LocationFinder;
