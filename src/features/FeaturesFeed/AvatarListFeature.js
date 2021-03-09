import React from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';
import {
  Avatar,
  PaddedView,
  H4,
  H6,
  styled,
  Card,
  CardContent,
} from '@apollosproject/ui-kit';
import { get } from 'lodash';

const Title = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
}))(H4);

const Subtitle = styled(({ theme }) => ({
  fontWeight: '400',
}))(H6);

const Flag = styled({
  flexDirection: 'row',
})(View);

const FlagMedia = styled(({ theme }) => ({}))(PaddedView);

const FlagContent = styled({
  justifyContent: 'center',
})(View);

const PeopleCard = (props) => (
  <Card>
    <CardContent {...props} />
  </Card>
);

const AvatarListFeature = ({
  featureId,
  onPressItem,
  isCard,
  people,
  primaryAction,
  isLoading,
}) => {
  const Container = isCard ? PeopleCard : View;

  /**
   * If an error exists or if we are loaded and there are no people, return null
   */
  if (!isLoading && people.length < 1) return null;

  return (
    <Container>
      {people.map((person) => (
        <Flag key={person.id}>
          <FlagMedia>
            <Avatar
              buttonIcon={get(primaryAction, 'icon')}
              onPressIcon={() => onPressItem(primaryAction)}
              size={'medium'}
              source={get(person, 'photo')}
            />
          </FlagMedia>
          <FlagContent>
            <Title isLoading={isLoading}>{`${get(person, 'firstName')} ${get(
              person,
              'lastName'
            )}`}</Title>
            {get(person, 'campus.name') && (
              <Subtitle isLoading={isLoading}>
                {get(person, 'campus.name')}
              </Subtitle>
            )}
          </FlagContent>
        </Flag>
      ))}
    </Container>
  );
};

AvatarListFeature.propTypes = {
  featureId: PropTypes.string,
  onPressItem: PropTypes.func,
  primaryAction: PropTypes.shape({
    action: PropTypes.string,
    icon: PropTypes.string,
    theme: PropTypes.shape({}),
    relatedNode: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  people: PropTypes.array,
  isLoading: PropTypes.bool,
  isCard: PropTypes.bool,
};

AvatarListFeature.defaultProps = {
  isLoading: false,
  people: [],
  isCard: true,
};

export default AvatarListFeature;
