import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { styled, Button, Card, CardContent, H4 } from '@apollosproject/ui-kit';

import { TextInput } from '../ui/inputs';

import { useForm } from '../hooks';

// :: Styled Components
// ------------------------------------------------------------------

export const FormTitle = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(H4);

const ButtonsRow = styled(({ theme }) => ({
  flex: 1,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: theme.sizing.baseUnit,
}))(View);

// :: Core Component
// ------------------------------------------------------------------

const ResourceUrlForm = (props) => {
  const { values, setValue } = useForm({
    defaultValues: {
      title: '',
      url: '',
    },
  });

  const handleSubmit = () => props.onSubmit(values);

  return (
    <Card>
      <CardContent>
        <FormTitle>Add new Resource</FormTitle>
        <TextInput
          label="Title"
          hidePrefix
          value={values.title}
          onChangeText={(newTitle) => setValue('title', newTitle)}
          returnKeyType="done"
        />
        <TextInput
          label="Link (URL)"
          hidePrefix
          value={values.url}
          onChangeText={(newUrl) => setValue('url', newUrl)}
          returnKeyType="done"
        />
        <ButtonsRow>
          <Button
            type="secondary"
            bordered
            pill={false}
            title="Cancel"
            onPress={props.onCancel}
          />
          <Button pill={false} title="Done" onPress={handleSubmit} />
        </ButtonsRow>
      </CardContent>
    </Card>
  );
};

ResourceUrlForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ResourceUrlForm;
