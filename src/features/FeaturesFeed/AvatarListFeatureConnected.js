import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
  PaddedView,
  H4,
  H6,
  styled,
  Card,
  CardContent,
} from '@apollosproject/ui-kit';
import { UserAvatarConnected } from '@apollosproject/ui-connected';
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

const AvatarListFeatureConnected = ({
  isCard,
  people,
  onPressItem,
  primaryAction,
  isLoading,
}) => {
  const Container = isCard ? PeopleCard : View;

  return (
    <Container>
      {people.map((person) => (
        <Flag key={person.id}>
          <FlagMedia>
            <UserAvatarConnected
              size={'medium'}
              buttonIcon={get(primaryAction, 'icon')}
              onPressIcon={() => onPressItem(primaryAction)}
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

AvatarListFeatureConnected.propTypes = {
  onPressItem: PropTypes.func,
  isLoading: PropTypes.bool,
  isCard: PropTypes.bool,
  primaryAction: PropTypes.shape({
    action: PropTypes.string,
    icon: PropTypes.string,
    theme: PropTypes.shape({}),
    relatedNode: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  people: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.shape({}),
      photo: PropTypes.shape({
        uri: PropTypes.string,
      }),
      campus: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    })
  ),
};

AvatarListFeatureConnected.defaultProps = {
  isCard: true,
  isLoading: false,
  people: [],
};

export default AvatarListFeatureConnected;
