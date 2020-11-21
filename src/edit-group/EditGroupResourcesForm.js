import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { get } from 'lodash';
import Color from 'color';

import {
  styled,
  ActivityIndicator,
  BodyText,
  Button,
  ButtonLink,
  ErrorCard,
  H5,
  Icon,
  Touchable,
  withTheme,
} from '@apollosproject/ui-kit';

import { useGroup } from '../hooks';

import {
  // GET_GROUP_RESOURCE_OPTIONS,
  UPDATE_GROUP_RESOURCE_URL,
  REMOVE_GROUP_RESOURCE,
} from './queries';

const ResourceShape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  action: PropTypes.string,
  relatedNode: PropTypes.shape({
    __typename: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),
});

const RESOURCE_TYPES = Object.freeze({
  URL: 'Url',
  STUDY: 'MediaContentItem',
});

// :: Styled Components
// ------------------------------------------------------------------

const LoadingContainer = styled(({ theme }) => ({
  flex: 1,
  minHeight: 150,
}))(View);

const Row = styled(({ theme }) => ({
  flex: 1,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
}))(View);

const EmptyResourcesList = styled(({ theme }) => ({
  minHeight: 96,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const ResourceListItemContainer = styled(
  ({ theme, removing, borderBottom }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.sizing.baseUnit,
    marginBottom: theme.sizing.baseUnit,
    opacity: removing ? theme.alpha.medium : 1,
    borderBottomWidth: borderBottom ? 1 : 0,
    borderBottomColor: Color(theme.colors.text.tertiary)
      .fade(theme.alpha.high)
      .string(),
  })
)(View);

const AddIcon = withTheme(({ theme }) => ({
  name: 'plus',
  size: 20,
  fill: theme.colors.primary,
  style: {
    marginRight: theme.sizing.baseUnit / 2,
  },
}))(Icon);

const RemoveIconTouchable = withTheme(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  backgroundColor: 'cyan',
}))(Touchable);

const RemoveIcon = withTheme(({ theme }) => ({
  name: 'close',
  size: 20,
  fill: theme.colors.alert,
}))(Icon);

// :: Sub-Components
// ------------------------------------------------------------------

// ---
const AddNewResourceButton = (props) => (
  <Button bordered pill={false} onPress={props.onPress}>
    <AddIcon />
    <H5>Add Resource</H5>
  </Button>
);
AddNewResourceButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

// ---
const AddResourceUrlForm = (props) => {
  const [title, setTitle] = useState('A Different Google Link');
  const [url, setUrl] = useState('https://google.com/different');

  const handleSubmit = () => props.onSubmit({ title, url });

  return (
    <View>
      <Row>
        <Button
          type="secondary"
          bordered
          pill={false}
          title="Cancel"
          onPress={props.onCancel}
        />
        <Button pill={false} title="Add Resource" onPress={handleSubmit} />
      </Row>
    </View>
  );
};
AddResourceUrlForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// ---

// ⚠️ Warning: Prop drilling of onRemoveResource! Create Context?
const ResourceListItem = ({ resource, isLastItem, onRemoveResource }) => {
  const [removing, setRemoving] = useState(false);
  const isUrl = resource.relatedNode.__typename === RESOURCE_TYPES.URL;

  const handleRemove = () => {
    setRemoving(true);
    onRemoveResource(resource.id);
  };

  return (
    <ResourceListItemContainer removing={removing} borderBottom={!isLastItem}>
      <View>
        <BodyText bold>{resource.title}</BodyText>
        {isUrl ? (
          <ButtonLink>{resource.relatedNode.url}</ButtonLink>
        ) : (
          <BodyText>Study</BodyText>
        )}
      </View>
      <RemoveIconTouchable onPress={handleRemove} disabled={removing}>
        <RemoveIcon />
      </RemoveIconTouchable>
    </ResourceListItemContainer>
  );
};
ResourceListItem.propTypes = {
  resource: ResourceShape,
  isLastItem: PropTypes.bool,
  onRemoveResource: PropTypes.func.isRequired,
};

// ---
const ResourcesList = (props) => (
  <View>
    {!get(props, 'resources.length', 0) && (
      <EmptyResourcesList>
        <H5>No group resources</H5>
      </EmptyResourcesList>
    )}
    {props.resources.map((resource, index) => (
      <ResourceListItem
        key={resource.id}
        resource={resource}
        onRemoveResource={props.onRemoveResource}
        isLastItem={index === props.resources.length - 1}
      />
    ))}
  </View>
);
ResourcesList.propTypes = {
  resources: PropTypes.arrayOf(ResourceShape),
  onRemoveResource: PropTypes.func.isRequired,
};

// :: Core Component
// ------------------------------------------------------------------
const EditGroupResourcesForm = ({
  loading,
  error,
  resources = [],
  // resourceOptions = [],
  addFormVisible,
  onShowAddForm,
  onHideAddForm,
  onUpdateUrlResource,
  onRemoveResource,
}) => {
  if (error) return <ErrorCard />;

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator />
      </LoadingContainer>
    );
  }

  return (
    <View>
      <ResourcesList
        resources={resources}
        onRemoveResource={onRemoveResource}
      />

      {!addFormVisible && (
        <AddNewResourceButton
          onPress={addFormVisible ? onHideAddForm : onShowAddForm}
        />
      )}

      {addFormVisible && (
        <AddResourceUrlForm
          onSubmit={onUpdateUrlResource}
          onCancel={onHideAddForm}
        />
      )}
    </View>
  );
};

EditGroupResourcesForm.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  resources: PropTypes.arrayOf(ResourceShape).isRequired,
  // resourceOptions: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     __typename: PropTypes.string,
  //     id: PropTypes.string,
  //     title: PropTypes.string,
  //   })
  // ).isRequired,
  addFormVisible: PropTypes.bool,
  onShowAddForm: PropTypes.func.isRequired,
  onHideAddForm: PropTypes.func.isRequired,
  onUpdateUrlResource: PropTypes.func.isRequired,
  onRemoveResource: PropTypes.func.isRequired,
};

EditGroupResourcesForm.defaultProps = {
  loading: false,
  error: null,
};

// :: Connected Component
// ------------------------------------------------------------------
const EditGroupResourcesFormConnected = (props) => {
  const [addFormVisible, setAddFormVisible] = useState(false);

  // Resource content item options
  const { group, loading, error, refetch } = useGroup(props.groupId);
  // const { data, loading, error } = useQuery(GET_GROUP_RESOURCE_OPTIONS, {
  //   fetchPolicy: 'cache-and-network',
  // });
  const [updateResourceUrl] = useMutation(UPDATE_GROUP_RESOURCE_URL);
  const [removeResource] = useMutation(REMOVE_GROUP_RESOURCE);

  // Event Handlers
  const handleShowAddForm = () => setAddFormVisible(true);
  const handleHideAddForm = () => setAddFormVisible(false);

  const handleUpdateUrlResource = async (fields) => {
    await updateResourceUrl({
      variables: {
        groupId: props.groupId,
        title: fields.title,
        url: fields.url,
      },
    });

    handleHideAddForm();
  };

  const handleRemoveResource = async (id) => {
    Alert.alert(
      'Delete Group Resource',
      'Are you sure you want to delete this group resource?',
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeResource({
              variables: {
                groupId: props.groupId,
                id,
              },
            });
            refetch();
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <EditGroupResourcesForm
      {...props}
      loading={loading}
      error={error}
      resources={get(group, 'resources', [])}
      // resourceOptions={get(data, 'groupResourceOptions', [])}
      addFormVisible={addFormVisible}
      onShowAddForm={handleShowAddForm}
      onHideAddForm={handleHideAddForm}
      onUpdateUrlResource={handleUpdateUrlResource}
      onRemoveResource={handleRemoveResource}
    />
  );
};
EditGroupResourcesFormConnected.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default EditGroupResourcesFormConnected;
