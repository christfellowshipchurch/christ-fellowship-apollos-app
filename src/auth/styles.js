import React from 'react';
import {
  Platform,
  View,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { SafeAreaView } from 'react-navigation';
import {
  styled,
  Card,
  Button,
  withTheme,
  Icon,
  H2,
  H5,
  H6,
  Radio,
  DateInput,
  PaddedView,
  BackgroundView,
  ButtonLink,
  UIText,
  Touchable,
} from '@apollosproject/ui-kit';

// TODO:
// Export these from ui-auth so I can delete this file.

const FlexedSafeAreaView = compose(
  styled({ height: '100%' }, 'ui-auth.FlexedSafeAreaView'),
  withProps({ forceInset: { top: 'always' } })
)(SafeAreaView);

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: theme.colors.text.primary,
  marginBottom: theme.sizing.baseUnit,
}))(Icon);

const TitleText = styled(
  ({ theme }) => ({
    color: theme.colors.action.primary,
  }),
  'ui-auth.TitleText'
)(H2);

const PromptText = styled(
  ({ theme }) => ({
    color: theme.colors.text.primary,
    paddingBottom: theme.sizing.baseUnit * 1.5,
  }),
  'ui-auth.PromptText'
)(H5);

const LegalText = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
    fontWeight: 'normal',
  }),
  'ui-auth.EmailEntry.LegalText'
)(H6);

// Tab Login

const TabWrapper = styled(
  ({ theme }) => ({
    marginHorizontal: 0,
    marginVertical: 0,
    ...Platform.select(theme.shadows.default),
  }),
  'ui-auth.TabWrapper'
)(Card);

const TabContainer = styled(
  ({ alternateLogin }) => ({
    flexDirection: alternateLogin ? 'row-reverse' : 'row',
    flex: 1,
  }),
  'ui-auth.TabContainer'
)(View);

const TabButtonWrapper = styled({ width: '50%' }, 'ui-auth.TabButtonWrapper')(
  View
);

const TabButton = styled(
  ({ theme, isActive }) => ({
    alignItems: 'center',
    backgroundColor: isActive
      ? theme.colors.background.paper
      : theme.colors.lightSecondary,
    borderRadius: 0,
    borderWidth: 0,
    color: isActive ? theme.colors.text.primary : theme.colors.text.tertiary,
    flexDirection: 'row',
    fontSize: theme.helpers.rem(0.75),
    fontWeight: 'normal',
    height: theme.sizing.baseUnit * 3,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: theme.sizing.baseUnit,

    ...Platform.select(theme.shadows.none),
  }),
  'ui-auth.TabButton'
)(View);

const TabCard = styled(
  ({ theme }) => ({
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    ...Platform.select(theme.shadows.none),
  }),
  'ui-auth.TabCard'
)(Card);

const FieldLabel = styled(
  ({ theme, padded }) => ({
    color: 'gray',
    opacity: 0.7,
    ...(padded ? { marginTop: theme.sizing.baseUnit } : {}),
  }),
  'ui-auth.FieldLabel'
)(H6);

const DatePicker = styled(
  ({ theme }) => ({
    marginTop: 0,
    marginBottom: theme.sizing.baseUnit,
  }),
  'ui-auth.DatePicker'
)(DateInput);

const RadioInput = styled(
  ({ theme }) => ({
    marginBottom: theme.sizing.baseUnit,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  }),
  'ui-auth.RadioInput'
)(Radio);

const RadioLabel = styled(
  ({ theme }) => ({
    marginLeft: theme.sizing.baseUnit * 0.5,
  }),
  'ui-auth.RadioLabel'
)(H5);

const SuppressingView = styled(
  {
    flexDirection: 'row',
  },
  'ui-auth.BackButton.SuppressingView'
)(View);

const BackButtonButton = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius,
}))(Touchable);

const ButtonWrapper = styled(
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  'ui-auth.BackButton.ButtonWrapper'
)(PaddedView);

const BackButtonIcon = withTheme(({ theme }) => ({
  fill: theme.colors.action.secondary,
  size: theme.sizing.baseUnit * 1.5,
  style: {
    paddingRight: 0,
  },
}))(Icon);

const BackButton = ({ onPress }) => (
  <SuppressingView>
    <BackButtonButton onPress={() => onPress()}>
      <ButtonWrapper>
        <BackButtonIcon name="arrow-back" />
        <UIText>
          <ButtonLink>Back</ButtonLink>
        </UIText>
      </ButtonWrapper>
    </BackButtonButton>
  </SuppressingView>
);

BackButton.propTypes = {
  onPress: PropTypes.func,
};

const ProfileEntryFieldContainer = ({
  BackgroundComponent,
  onPressBack,
  onPressNext,
  disabled,
  title,
  prompt,
  isLoading,
  children,
}) => (
  <KeyboardAvoidingView
    style={StyleSheet.absoluteFill}
    behavior={'padding'}
    keyboardVerticalOffset={
      Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  >
    <BackgroundComponent>
      <FlexedSafeAreaView>
        <ScrollView>
          <BackButton onPress={() => onPressBack()} />
          <PaddedView>
            <TitleText>{title}</TitleText>
            <PromptText padded>{prompt}</PromptText>
            {children}
          </PaddedView>
        </ScrollView>

        {onPressNext ? (
          <PaddedView>
            <Button
              onPress={onPressNext}
              disabled={disabled}
              loading={isLoading}
              title={'Next'}
              type={'primary'}
              pill={false}
            />
          </PaddedView>
        ) : null}
      </FlexedSafeAreaView>
    </BackgroundComponent>
  </KeyboardAvoidingView>
);

ProfileEntryFieldContainer.propTypes = {
  title: PropTypes.node,
  prompt: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onPressBack: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

ProfileEntryFieldContainer.defaultProps = {
  BackgroundComponent: BackgroundView,
};

export {
  FlexedSafeAreaView,
  BrandIcon,
  TitleText,
  PromptText,
  LegalText,
  TabCard,
  TabButton,
  TabContainer,
  TabButtonWrapper,
  TabWrapper,
  FieldLabel,
  DatePicker,
  RadioInput,
  RadioLabel,
  ProfileEntryFieldContainer,
};
