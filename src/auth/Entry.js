import React from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import { get } from 'lodash';
import {
  BackgroundView,
  Button,
  PaddedView,
  TextInput,
  styled,
  withTheme,
  Touchable,
} from '@apollosproject/ui-kit';

import {
  FlexedSafeAreaView,
  LegalText,
  PromptText,
  TabButton,
  TabButtonWrapper,
  TabCard,
  TabContainer,
  TabWrapper,
  TitleText,
} from './styles';

const FullScreenImage = styled({
  resizeMode: 'cover',
  position: 'absolute',
})(BackgroundView);

const Entry = ({
  BackgroundComponent,
  alternateLoginText,
  authTitleText,
  disabled,
  errors,
  inputLabel,
  inputType,
  isLoading,
  onPressAlternateLogin,
  onPressNext,
  policyInfo,
  promptText,
  setFieldValue,
  tabTitle,
  theme,
  values,
  inputAutoComplete,
  alternateLogin,
}) => {
  const handleOnChangeText = (text) => setFieldValue(inputType, text);

  return (
    <KeyboardAvoidingView
      style={StyleSheet.absoluteFill}
      behavior={'padding'}
      keyboardVerticalOffset={
        Platform.OS === 'android' ? StatusBar.currentHeight : 0
      }
    >
      <BackgroundComponent />
      <FlexedSafeAreaView>
        <ScrollView>
          <PaddedView>
            <TitleText>{authTitleText}</TitleText>
            <PromptText padded>{promptText}</PromptText>
            <TabWrapper>
              <TabContainer alternateLogin={alternateLogin}>
                <TabButtonWrapper>
                  <Touchable>
                    <TabButton alternateLogin={alternateLogin} isActive>
                      <Text>{tabTitle}</Text>
                    </TabButton>
                  </Touchable>
                </TabButtonWrapper>

                {onPressAlternateLogin ? (
                  <TabButtonWrapper>
                    <Touchable onPress={onPressAlternateLogin}>
                      <TabButton alternateLogin={alternateLogin}>
                        <Text>{alternateLoginText}</Text>
                      </TabButton>
                    </Touchable>
                  </TabButtonWrapper>
                ) : null}
              </TabContainer>
              <TabCard>
                <PaddedView>
                  <TextInput
                    autoComplete={inputAutoComplete}
                    autoFocus
                    enablesReturnKeyAutomatically
                    error={get(errors, inputType)}
                    label={inputLabel}
                    labelColor={theme.colors.text.tertiary}
                    onChangeText={handleOnChangeText}
                    onSubmitEditing={onPressNext}
                    returnKeyType={'next'}
                    type={inputType}
                    value={get(values, inputType)}
                  />
                  <LegalText>{policyInfo}</LegalText>
                </PaddedView>
              </TabCard>
            </TabWrapper>
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
    </KeyboardAvoidingView>
  );
};

Entry.propTypes = {
  alternateLogin: PropTypes.bool,
  alternateLoginText: PropTypes.node,
  authTitleText: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.shape({
    phone: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onPressAlternateLogin: PropTypes.func,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  setFieldValue: PropTypes.func.isRequired,
  policyInfo: PropTypes.string,
  promptText: PropTypes.string,
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  tabTitle: PropTypes.string,
  inputType: PropTypes.string,
  inputLabel: PropTypes.string,
  inputAutoComplete: PropTypes.string,
  theme: PropTypes.shape({
    colors: PropTypes.shape({}),
  }),
};

Entry.defaultProps = {
  authTitleText: 'Have we met?',
  promptText:
    'Sign in for a personalized experience that helps you grow and connect with God.',
  BackgroundComponent: FullScreenImage,
  alternateLogin: false,
};

Entry.displayName = 'Entry';

export default withTheme()(Entry);
