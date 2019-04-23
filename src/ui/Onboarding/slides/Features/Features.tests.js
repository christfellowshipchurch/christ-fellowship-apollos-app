import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'ChristFellowship/src/Providers';

import Features from '.';

describe('The Onboarding SlideWrapper component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <Features />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom image', () => {
    const tree = renderer.create(
      <Providers>
        <Features imgSrc={{ uri: 'https://picsum.photos/1200/1200?random' }} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render a custom first name', () => {
    const tree = renderer.create(
      <Providers>
        <Features firstName={'firstName'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <Features slideTitle={'Custom title text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <Features description={'Custom description text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide', () => {
    const tree = renderer.create(
      <Providers>
        <Features onPressPrimary={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
