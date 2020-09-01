import React from 'react';
import { Text } from 'react-native';
import { ScriptureText, VerseNumber } from '@apollosproject/ui-scripture';
import { BodyText } from '@apollosproject/ui-kit';
import {
  AddPrayerScreenConnected,
  PrayerDialogScreen,
  ConfirmationDialogScreen,
} from '@apollosproject/ui-prayer/src/screens';
import { PrayerCard } from '@apollosproject/ui-prayer';

export default {
  'ui-prayer.PrayerExperienceConnected': {
    showOnboarding: true,
  },
  'ui-prayer.PrayerInput.PromptIcon': {
    name: 'plus',
  },
  // 'ui-prayer.PrayerInput.Prompt': {

  // },
  'ui-prayer.PrayerExperience': {
    AddPrayerComponent: (props) => (
      <AddPrayerScreenConnected
        {...props}
        title="How can others pray for you?"
        skipText="Pray for others"
        primaryButtonText="Share my prayer"
        AddedPrayerComponent={(props) => (
          <ConfirmationDialogScreen
            {...props}
            body={
              <Text>
                <ScriptureText>
                  This is the confidence we have in approaching God: that if we
                  ask anything according to his will, he hears us.
                  {'\n'}
                  <VerseNumber>1 John 5:14</VerseNumber>
                </ScriptureText>
                {'\n\n'}
                <BodyText>We’re partnering with you in prayer today!</BodyText>
              </Text>
            }
          />
        )}
        PrayerCardComponent={(props) => (
          <PrayerCard
            {...props}
            // prayer="I'd like prayer for..."
          />
        )}
      />
    ),
    OnboardingComponent: (props) => (
      <PrayerDialogScreen
        {...props}
        title="Let’s pray today!"
        body="As we always say, prayer is our first response, not our last resort. Let your church family know how they can be praying for you, and then pray for their requests too! Don't walk through life alone—join together in prayer!"
      />
    ),
  },
};
