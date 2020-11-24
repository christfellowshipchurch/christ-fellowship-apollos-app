import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Color from 'color';

import { styled, H5, Icon, Touchable, withTheme } from '@apollosproject/ui-kit';
import ActionListItem from 'ui/ActionListItem';

import { ResourceShape } from './EditGroupPropTypes';

// :: Styled Components
// ------------------------------------------------------------------

const Container = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit,
}))(View);

const EmptyResourcesList = styled(({ theme }) => ({
  minHeight: 96,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const ResourceListItemContainer = styled(({ theme, borderBottom }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.sizing.baseUnit * 0.5,
  paddingRight: theme.sizing.baseUnit,
  marginBottom: theme.sizing.baseUnit,
  borderBottomWidth: borderBottom ? 1 : 0,
  borderBottomColor: Color(theme.colors.text.tertiary)
    .fade(theme.alpha.high)
    .string(),
}))(View);

const RemoveIconTouchable = withTheme(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  backgroundColor: 'cyan',
}))(Touchable);

const RemoveIcon = withTheme(({ theme }) => ({
  name: 'close',
  size: 12,
  fill: theme.colors.text.secondary,
}))(Icon);

// :: Sub-Components
// ------------------------------------------------------------------

// ⚠️ Warning: Prop drilling of onRemoveResource! Create Context?
const ResourceListItem = ({
  resource,
  isLastItem,
  disableRemoval,
  onRemoveResource,
}) => {
  const isUrlResource = resource.action === 'OPEN_URL';
  const actionListItemProps = isUrlResource
    ? {
        title: resource.title,
        label: resource.relatedNode.url,
        icon: 'link',
      }
    : {
        title: resource.title,
        label: get(resource, 'relatedNode.label'),
        imageSource: get(resource, 'relatedNode.coverImage.sources[0].uri'),
      };

  console.log({ resource });

  const handleRemove = () => {
    onRemoveResource(resource.id);
  };

  return (
    <ResourceListItemContainer borderBottom={!isLastItem}>
      <ActionListItem {...actionListItemProps} />
      <RemoveIconTouchable onPress={handleRemove} disabled={disableRemoval}>
        <RemoveIcon />
      </RemoveIconTouchable>
    </ResourceListItemContainer>
  );
};
ResourceListItem.propTypes = {
  resource: ResourceShape,
  disableRemoval: PropTypes.bool,
  isLastItem: PropTypes.bool,
  onRemoveResource: PropTypes.func.isRequired,
};

// :: Core Component
// ------------------------------------------------------------------

const ResourcesList = (props) => (
  <Container>
    {!get(props, 'resources.length', 0) && (
      <EmptyResourcesList>
        <H5>No group resources</H5>
      </EmptyResourcesList>
    )}
    {props.resources.map((resource, index) => (
      <ResourceListItem
        key={resource.id}
        resource={resource}
        disableRemoval={props.disableRemoval}
        onRemoveResource={props.onRemoveResource}
        isLastItem={index === props.resources.length - 1}
      />
    ))}
  </Container>
);

ResourcesList.propTypes = {
  resources: PropTypes.arrayOf(ResourceShape).isRequired,
  disableRemoval: PropTypes.bool,
  onRemoveResource: PropTypes.func.isRequired,
};

ResourcesList.defaultProps = {
  disableRemoval: false,
};

export default ResourcesList;
