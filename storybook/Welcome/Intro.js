import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import {
  BackgroundView,
  Paragraph,
  BodyText,
  H2,
  PaddedView,
  styled,
} from '@apollosproject/ui-kit';

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const Intro = () => (
  <BackgroundView>
    <ScrollView>
      <SafeAreaView>
        <PaddedView>
          <Title>{`Welcome to ${'\n'}Apollos Storybook!`}</Title>
          <Paragraph>
            <BodyText>
              Storybook is the component workshop for the Apollos app platform.
            </BodyText>
          </Paragraph>
          <Paragraph>
            <BodyText>
              A story is a single state of one or more UI components. You can
              have as many stories as you want.
            </BodyText>
          </Paragraph>
          <Paragraph>
            <BodyText>
              We use Storybook to help document UI and to serve as visual test
              cases for different states.
            </BodyText>
          </Paragraph>
          <Paragraph>
            <BodyText>
              Open the navigator using the navigation bar at the bottom of the
              screen to navigate the available stories.
            </BodyText>
          </Paragraph>
          <Paragraph>
            <BodyText>
              The stories defined inside of your app will be listed first, with
              Apollos UI stories below them. If you setup a theme, all of the
              stories will reflect your theme.
            </BodyText>
          </Paragraph>
        </PaddedView>
      </SafeAreaView>
    </ScrollView>
  </BackgroundView>
);

export default Intro;
