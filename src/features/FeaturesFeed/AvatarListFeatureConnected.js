import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import {
  Avatar,
  PaddedView,
  H4,
  H6,
  styled,
  Card,
  CardContent,
} from '@apollosproject/ui-kit';
import { get, isEmpty } from 'lodash';
import ApollosConfig from '@apollosproject/config';

const { FRAGMENTS } = ApollosConfig;

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

const GET_AVATAR_LIST_FEATURE = gql`
  query getAvatarListFeature($featureId: ID!) {
    node(id: $featureId) {
      ...AvatarListFeatureFragment
    }
  }

  ${FRAGMENTS.AVATAR_LIST_FRAGMENT}
  ${FRAGMENTS.THEME_FRAGMENT}
  ${FRAGMENTS.RELATED_NODE_FRAGMENT}
`;

const AvatarListFeatureConnected = ({ featureId, onPressItem }) => {
  const { data, loading, error } = useQuery(GET_AVATAR_LIST_FEATURE, {
    fetchPolicy: 'cache-and-network',
    variables: { featureId },
    skip: isEmpty(featureId),
  });
  const isCard = get(data, 'node.isCard', true);
  const people = get(data, 'node.people', []);
  const primaryAction = get(data, 'node.primaryAction', {});
  const Container = isCard ? PeopleCard : View;

  /**
   * If an error exists or if we are loaded and there are no people, return null
   */
  if (error || (!loading && people.length < 1)) return null;

  const isLoading = !data && loading;

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

AvatarListFeatureConnected.propTypes = {
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
};

AvatarListFeatureConnected.defaultProps = {};

export default AvatarListFeatureConnected;
