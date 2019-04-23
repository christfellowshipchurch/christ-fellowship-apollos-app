import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'ChristFellowship/src/Providers';

import Splash from '.';

describe('The Onboarding Splash component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <Splash />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render light text on a dark background', () => {
    const tree = renderer.create(
      <Providers>
        <Splash
          imgSrc={{
            uri: 'https://picsum.photos/1200/1200?random',
            height: 1200,
            width: 1200,
          }}
          isLight={false}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <Splash slideTitle={'Custom title text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <Splash description={'Custom description text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide', () => {
    const tree = renderer.create(
      <Providers>
        <Splash onPressPrimary={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
