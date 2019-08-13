import React from 'react'
import { ScrollView } from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import {
  styled,
  H2,
  H5,
  PaddedView,
  FlexedSafeAreaView,
  BackgroundView
} from '@apollosproject/ui-kit'

const TitleText = styled(
  ({ theme }) => ({
    color: theme.colors.primary,
  }),
  'ui-auth.TitleText'
)(H2);

const PromptText = styled(
  ({ theme }) => ({
    color: theme.colors.text.secondary,
  }),
  'ui-auth.PromptText'
)(H5);

const GeneratePolicy = () => {
  let policy = "Blah blah blah bleebidy bloobidy do."

  for (var i = 0; i < 30; i++) {
    policy = `${policy} Blah blah blah bleebidy bloobidy do.`
  }

  return policy
}

const PrivacyPolicy = () => {
  return (
    <BackgroundView>
      <ScrollView>
        <PaddedView>
          <TitleText>So, what does CF do with all my info?</TitleText>
          <PromptText>
            <GeneratePolicy />
          </PromptText>
        </PaddedView>
      </ScrollView>
    </BackgroundView>
  )
}

PrivacyPolicy.navigationOptions = {
  title: 'Why do you want my info?',
  headerMode: 'screen',
  headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />
}

export default PrivacyPolicy