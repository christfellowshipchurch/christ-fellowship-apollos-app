/**
 * MembersFeed/index.js
 *
 * Author: Caleb Panza
 * Created: Feb 03, 2021
 *
 * This file was created for 2 reasons:
 * 1. Export the Preview Feed for Members as well as the Vertical Feed for _all_ members
 * 2. Since there is some route props that need to be mapped to the connected components, the default export is a wrapper component for getting Route Props to the `MembersFeedConnected`
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import {
  BackgroundView,
  FlexedView,
  styled,
  UIText,
  Touchable,
} from '@apollosproject/ui-kit';

import MembersFeedConnected from './MembersFeedConnected';

const StyledFlexedView = styled(({ theme }) => ({}))(FlexedView);

const CloseButtonLayout = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
}))(View);

const TouchableSpacing = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
}))(View);

const CloseText = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(UIText);

const CloseButton = () => {
  const navigation = useNavigation();
  const onPress = () => navigation.goBack();

  return (
    <CloseButtonLayout>
      <Touchable onPress={onPress}>
        <TouchableSpacing>
          <CloseText bold>Close</CloseText>
        </TouchableSpacing>
      </Touchable>
    </CloseButtonLayout>
  );
};

const MembersFeed = (props) => {
  const id = props.route?.params?.id;

  return (
    <BackgroundView>
      <CloseButton />
      <StyledFlexedView>
        <MembersFeedConnected id={id} />
      </StyledFlexedView>
    </BackgroundView>
  );
};

MembersFeed.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};
MembersFeed.defaultProps = {};

export {
  default as HorizontalMembersFeedPreview,
} from './HorizontalMembersFeedPreview';
export { default as MembersFeedConnected } from './MembersFeedConnected';
export default MembersFeed;
