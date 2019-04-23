import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import ScriptureText from '.';

storiesOf('Scripture/typography/ScriptureText', module)
  .add('Regular', () => (
    <ScriptureText>
      {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
    </ScriptureText>
  ))
  .add('Bold', () => (
    <ScriptureText bold>
      {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
    </ScriptureText>
  ))
  .add('Italic', () => (
    <ScriptureText italic>
      {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
    </ScriptureText>
  ))
  .add('Bold Italic', () => (
    <ScriptureText bold italic>
      {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
    </ScriptureText>
  ))
  .add('isLoading', () => (
    <ScriptureText isLoading>
      {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
    </ScriptureText>
  ))
  .add('Border Box – platform testing', () => {
    const border = { borderWidth: 1, borderStyle: 'solid' };

    return (
      <View>
        <ScriptureText style={border}>Body Text</ScriptureText>
        <ScriptureText style={border}>
          {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
        </ScriptureText>
      </View>
    );
  });
