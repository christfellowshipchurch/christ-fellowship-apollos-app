import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { get } from 'lodash';

import {
  styled,
  ActivityIndicator,
  ErrorCard,
  PaddedView,
} from '@apollosproject/ui-kit';

import ActionBar, { ActionBarItem } from '../ui/ActionBar';
import { useGroup } from '../hooks';

import {
  // GET_GROUP_RESOURCE_OPTIONS,
  UPDATE_GROUP_RESOURCE_URL,
  REMOVE_GROUP_RESOURCE,
} from './queries';

import { ResourceShape } from './EditGroupPropTypes';

import ResourcesList from './ResourcesList';
import ResourceUrlForm from './ResourceUrlForm';

// :: Styled Components
// ------------------------------------------------------------------

const LoadingContainer = styled(({ theme }) => ({
  flex: 1,
  minHeight: 150,
}))(View);

// :: Core Component
// ------------------------------------------------------------------

const ResourcesSection = ({
  loading,
  error,
  resources = [],
  addFormVisible,
  onShowAddForm,
  onAddContentItem,
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
      {!addFormVisible && (
        <ActionBar>
          <ActionBarItem icon="link" label="Add Link" onPress={onShowAddForm} />
          <ActionBarItem
            icon="book-closed"
            label="Add Study"
            onPress={onAddContentItem}
          />
        </ActionBar>
      )}

      {addFormVisible && (
        <ResourceUrlForm
          existingResources={resources}
          onSubmit={onUpdateUrlResource}
          onCancel={onHideAddForm}
        />
      )}

      <PaddedView>
        <ResourcesList
          resources={resources}
          disableRemoval={addFormVisible}
          onRemoveResource={onRemoveResource}
        />
      </PaddedView>
    </View>
  );
};

ResourcesSection.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  resources: PropTypes.arrayOf(ResourceShape).isRequired,
  addFormVisible: PropTypes.bool,
  onShowAddForm: PropTypes.func.isRequired,
  onAddContentItem: PropTypes.func.isRequired,
  onHideAddForm: PropTypes.func.isRequired,
  onUpdateUrlResource: PropTypes.func.isRequired,
  onRemoveResource: PropTypes.func.isRequired,
};

ResourcesSection.defaultProps = {
  loading: false,
  error: null,
};

// :: Connected Component
// ------------------------------------------------------------------

const ResourcesSectionConnected = (props) => {
  const [addFormVisible, setAddFormVisible] = useState(false);

  // Resource content item options
  const { group, loading, error, refetch } = useGroup(props.groupId);
  const [updateResourceUrl] = useMutation(UPDATE_GROUP_RESOURCE_URL);
  const [removeResource] = useMutation(REMOVE_GROUP_RESOURCE);

  // Event Handlers
  const handleShowAddForm = () => setAddFormVisible(true);
  const handleHideAddForm = () => setAddFormVisible(false);

  const onAddContentItem = get(props, 'onAddContentItem', () => null);
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
            if (id) {
              await removeResource({
                variables: {
                  groupId: props.groupId,
                  id,
                },
              });
              refetch();
            }
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
    <ResourcesSection
      {...props}
      loading={loading}
      error={error}
      resources={get(group, 'resources', [])}
      addFormVisible={addFormVisible}
      onShowAddForm={handleShowAddForm}
      onAddContentItem={onAddContentItem}
      onHideAddForm={handleHideAddForm}
      onUpdateUrlResource={handleUpdateUrlResource}
      onRemoveResource={handleRemoveResource}
    />
  );
};
ResourcesSectionConnected.propTypes = {
  groupId: PropTypes.string.isRequired,
  onAddContentItem: PropTypes.func,
};

export default ResourcesSectionConnected;
