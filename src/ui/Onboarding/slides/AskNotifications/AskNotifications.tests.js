import React from 'react';
import renderer from 'react-test-renderer';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import Providers from 'ChristFellowship/src/Providers';

import AskNotifications from './AskNotifications';

describe('The Onboarding AskNotifications component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render children (image)', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications>
          <GradientOverlayImage
            source={'https://picsum.photos/640/640/?random'}
          />
        </AskNotifications>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications slideTitle={'Custom title text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications description={'Custom description text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a button', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications onPressButton={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render the button disabled', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications onPressButton={jest.fn()} buttonDisabled />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a button with custom text', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications
          onPressButton={jest.fn()}
          buttonText={'Custom button text'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide component', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications
          onPressSecondary={jest.fn()}
          secondaryNavText={'Later'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
