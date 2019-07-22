import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import Onboarding from '.';
import {
    LandingPage, Passcode, ProfileInformation
} from './slides'

storiesOf('Onboarding', module).add('full', () => <Onboarding />);
storiesOf('Onboarding', module).add('Landing Page', () => <LandingPage onPressNext={() => true} />);
storiesOf('Onboarding', module).add('SMS Passcode', () => <Passcode onPressNext={() => true} type='sms' username='5555555555' />);
storiesOf('Onboarding', module).add('User Made Passcode', () => <Passcode onPressNext={() => true} type='password' username='example@domain.com' />);
storiesOf('Onboarding', module).add('User Profile', () => <Passcode onPressNext={() => true} />);