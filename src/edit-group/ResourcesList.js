import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Color from 'color';

import {
  styled,
  BodyText,
  ButtonLink,
  H5,
  Icon,
  Touchable,
  withTheme,
} from '@apollosproject/ui-kit';

import { ResourceShape } from './EditGroupPropTypes';

const RESOURCE_TYPES = Object.freeze({
  URL: 'Url',
  STUDY: 'MediaContentItem',
});

// :: Styled Components
// ------------------------------------------------------------------

const EmptyResourcesList = styled(({ theme }) => ({
  minHeight: 96,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const ResourceListItemContainer = styled(({ theme, borderBottom }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.sizing.baseUnit,
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
  size: 20,
  fill: theme.colors.alert,
}))(Icon);

// ⚠️ Warning: Prop drilling of onRemoveResource! Create Context?
const ResourceListItem = ({
  resource,
  isLastItem,
  disableRemoval,
  onRemoveResource,
}) => {
  const isUrl = resource.relatedNode.__typename === RESOURCE_TYPES.URL;

  const handleRemove = () => {
    onRemoveResource(resource.id);
  };

  return (
    <ResourceListItemContainer borderBottom={!isLastItem}>
      <View>
        <BodyText bold>{resource.title}</BodyText>
        {isUrl ? (
          <ButtonLink>{resource.relatedNode.url}</ButtonLink>
        ) : (
          <BodyText>Study</BodyText>
        )}
      </View>
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
        disableRemoval={props.disableRemoval}
        onRemoveResource={props.onRemoveResource}
        isLastItem={index === props.resources.length - 1}
      />
    ))}
  </View>
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
