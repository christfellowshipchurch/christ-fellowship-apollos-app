import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'ChristFellowship/src/Providers';

import ScriptureText from '.';

describe('the ScriptureText component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <Providers>
        <ScriptureText>Default ScriptureText text</ScriptureText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as bold', () => {
    const tree = renderer.create(
      <Providers>
        <ScriptureText bold>Bold ScriptureText text</ScriptureText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as italic', () => {
    const tree = renderer.create(
      <Providers>
        <ScriptureText italic>Italic ScriptureText text</ScriptureText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as bold italic', () => {
    const tree = renderer.create(
      <Providers>
        <ScriptureText bold italic>
          Bold italic ScriptureText text
        </ScriptureText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept and render passed in styles', () => {
    const salmon = { color: 'salmon' };
    const tree = renderer.create(
      <Providers>
        <ScriptureText style={salmon}>Salmon text</ScriptureText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <ScriptureText isLoading>Default ScriptureText text</ScriptureText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept additional props', () => {
    const tree = renderer.create(
      <Providers>
        <ScriptureText accessible={false}>
          {
            '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
          }
        </ScriptureText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
