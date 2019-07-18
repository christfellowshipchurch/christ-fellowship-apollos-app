import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import Onboarding from '.';
import {
    LandingPage, ConfirmationCode, Password, ProfileInformation
} from './slides'

storiesOf('Onboarding', module).add('full', () => <Onboarding />);
storiesOf('Onboarding', module).add('Landing Page', () => <LandingPage onPressNext={() => true} />);
storiesOf('Onboarding', module).add('Confirmation Code', () => <ConfirmationCode onPressNext={() => true} />);
storiesOf('Onboarding', module).add('Password Returning User', () => <Password onPressNext={() => true} />);
storiesOf('Onboarding', module).add('Password New User', () => <Password onPressNext={() => true} />);
storiesOf('Onboarding', module).add('Profile Information', () => <ProfileInformation onPressNext={() => true} />);