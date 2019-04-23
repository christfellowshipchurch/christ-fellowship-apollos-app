import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'ChristFellowship/src/Providers';

import AskName from '.';

describe('The Onboarding AskName component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <AskName setFieldValue={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <AskName slideTitle={'Custom title text'} setFieldValue={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <AskName
          description={'Custom description text'}
          setFieldValue={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept a firstName', () => {
    const tree = renderer.create(
      <Providers>
        <AskName values={{ firstName: 'Marty' }} setFieldValue={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept a lastName', () => {
    const tree = renderer.create(
      <Providers>
        <AskName values={{ lastName: 'McFly' }} setFieldValue={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide component', () => {
    const tree = renderer.create(
      <Providers>
        <AskName onPressPrimary={jest.fn()} setFieldValue={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
