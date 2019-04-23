import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import Providers from 'ChristFellowship/src/Providers';

import Slide from '.';

describe('The Onboarding Slide component', () => {
  it('should render children', () => {
    const tree = renderer.create(
      <Providers>
        <Slide>
          <Text>Boom</Text>
        </Slide>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render onboarding next button navigation', () => {
    const tree = renderer.create(
      <Providers>
        <Slide onPressPrimary={jest.fn()}>
          <Text>Boom</Text>
        </Slide>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render primary navigation button with custom text', () => {
    const tree = renderer.create(
      <Providers>
        <Slide onPressPrimary={jest.fn()} primaryNavText={'Custom nav text'}>
          <Text>Boom</Text>
        </Slide>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render primary navigation button with a custom icon', () => {
    const tree = renderer.create(
      <Providers>
        <Slide
          onPressPrimary={jest.fn()}
          primaryNavText={'Custom nav text with custom icon'}
          primaryNavIcon={'umbrella'}
        >
          <Text>Boom</Text>
        </Slide>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render primary navigation button without a custom icon', () => {
    const tree = renderer.create(
      <Providers>
        <Slide
          onPressPrimary={jest.fn()}
          primaryNavText={'Custom nav text without an icon'}
          primaryNavIcon={''}
        >
          <Text>Boom</Text>
        </Slide>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render onboarding skip button navigation', () => {
    const tree = renderer.create(
      <Providers>
        <Slide onPressSecondary={jest.fn()}>
          <Text>Boom</Text>
        </Slide>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render onboarding skip button with custom text', () => {
    const tree = renderer.create(
      <Providers>
        <Slide
          onPressSecondary={jest.fn()}
          secondaryNavText={'Custom skip button text'}
        >
          <Text>Boom</Text>
        </Slide>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render both slide navigation buttons', () => {
    const tree = renderer.create(
      <Providers>
        <Slide onPressPrimary={jest.fn()} onPressSecondary={jest.fn()}>
          <Text>Boom</Text>
        </Slide>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
