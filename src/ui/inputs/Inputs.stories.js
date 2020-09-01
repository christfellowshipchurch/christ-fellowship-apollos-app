import React, { useState } from 'react';
import { Text, SafeAreaView, View, ScrollView } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';
import { styled, H4, BackgroundView } from '@apollosproject/ui-kit';
import moment from 'moment';

import {
  TextInput,
  Radio,
  RadioButton,
  Switch,
  Picker,
  PickerItem,
  DateInput,
} from '.';

const PaddedView = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 4,
  paddingHorizontal: theme.sizing.baseUnit,
}))(View);

const PaddedH4 = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit,
}))(H4);

storiesOf('cf-ui/inputs', module).add('Text Inputs', () => (
  <SafeAreaView>
    <PaddedView>
      <ScrollView>
        <PaddedH4>Text Input</PaddedH4>
        <TextInput label={'Default'} type={'text'} />

        <TextInput
          label={'Error'}
          type={'text'}
          error="Some error"
          errorIndicator
        />

        <TextInput label={'Success'} type={'text'} errorIndicator />

        <TextInput label={'Disabled'} type={'text'} disabled />
      </ScrollView>
    </PaddedView>
  </SafeAreaView>
));

storiesOf('cf-ui/inputs', module).add('Radio Inputs', () => (
  <SafeAreaView>
    <PaddedView>
      <ScrollView>
        <PaddedH4>Radio Input</PaddedH4>
        <Radio>
          <RadioButton label="option 1" value="one" />
          <RadioButton label="option 2" value="two" />
        </Radio>
      </ScrollView>
    </PaddedView>
  </SafeAreaView>
));

storiesOf('cf-ui/inputs', module).add('Switch Inputs', () => (
  <SafeAreaView>
    <PaddedView>
      <ScrollView>
        <PaddedH4>Switch Input</PaddedH4>
        <Switch value label="Active" />
        <Switch value={false} label="Unactive" />
      </ScrollView>
    </PaddedView>
  </SafeAreaView>
));

storiesOf('cf-ui/inputs', module).add('Picker Inputs', () => (
  <SafeAreaView>
    <PaddedView>
      <ScrollView>
        <PaddedH4>Picker Input</PaddedH4>
        <Picker label="One">
          <PickerItem label="One" value="one" />
          <PickerItem label="Two" value="two" />
        </Picker>
      </ScrollView>
    </PaddedView>
  </SafeAreaView>
));

const DateInputWithLabel = ({ label, ...props }) => {
  const [date, setDate] = useState(moment().toString());

  return (
    <>
      <PaddedH4>{`${label}: ${moment(date).format('MMMM D, YYYY')}`}</PaddedH4>
      <DateInput
        onConfirm={(dateStr) => setDate(dateStr)}
        value={date}
        {...props}
      />
    </>
  );
};

storiesOf('cf-ui/inputs', module).add('Date Inputs', () => (
  <BackgroundView>
    <SafeAreaView>
      <PaddedView>
        <ScrollView>
          <DateInputWithLabel label="Default Input" />
          <DateInputWithLabel
            label="Max Year (13 years ago)"
            maxYear={moment().year() - 13}
          />
          <DateInputWithLabel
            label="Min Year (13 years from now)"
            minYear={moment().year() + 13}
          />
          <DateInputWithLabel
            label="Year Range"
            minYear={1990}
            maxYear={1999}
          />
        </ScrollView>
      </PaddedView>
    </SafeAreaView>
  </BackgroundView>
));
