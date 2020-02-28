import React from 'react';
import { renderWithApolloData } from '../../utils/testUtils';

import Providers from '../../Providers';
import GET_CAMPUS_LOCATIONS from './getCampusLocations';
import Location from './index';

const campuses = [
  {
    __typename: 'Campus',
    id: 'Campus:559b23fd0aa90e81b1c023e72e230fa1',
    latitude: 34.59814,
    longitude: -82.62045,
    name: 'Anderson Campus',
    street1: '2940 Concord Rd',
    street2: '',
    city: 'Anderson',
    state: 'SC',
    distanceFromLocation: 5,
    postalCode: '29621-3619',
    image: {
      __typename: 'ImageMediaSource',
      uri:
        'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Da47e8e69-9542-42de-9ed3-ff42fdc82417',
    },
  },
  {
    __typename: 'Campus',
    id: 'Campus:965b6e6d7046a885bea4e300b5c0400d',
    latitude: 32.95103,
    longitude: -96.74738,
    name: 'Dallas Campus',
    street1: '102 N Weatherred Dr',
    street2: '',
    city: 'Richardson',
    state: 'TX',
    postalCode: '75080-5525',
    distanceFromLocation: 50,
    image: {
      __typename: 'ImageMediaSource',
      uri:
        'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D5f9fd97a-fd6e-4ae5-ab5d-a9b95290d9b6',
    },
  },
  {
    __typename: 'Campus',
    id: 'Campus:4f68015ba18662a7409d1219a4ce013e',
    latitude: 39.10501,
    longitude: -84.51138,
    name: 'Cincinnati Campus',
    street1: '120 E 8th St',
    street2: '',
    city: 'Cincinnati',
    state: 'OH',
    postalCode: '45202-2118',
    distanceFromLocation: 500,
    image: {
      __typename: 'ImageMediaSource',
      uri:
        'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Dbad9eb54-3e78-44a7-a028-3f2d6e71a36f',
    },
  },
  {
    __typename: 'Campus',
    id: 'Campus:a0f64573eabf00a607bec911794d50fb',
    latitude: 42.09203,
    longitude: -88.13289,
    name: 'Chicago Campus',
    street1: '67 Algonquin Rd',
    street2: '',
    city: 'South Barrington',
    state: 'IL',
    postalCode: '60010-6143',
    distanceFromLocation: 5000,
    image: {
      __typename: 'ImageMediaSource',
      uri:
        'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Dede1fb83-968e-4bef-8d77-ad81c96e8a47',
    },
  },
];

describe('The Location "finder"', () => {
  const initialRegion = {
    // roughly show the entire USA by default
    latitude: 39.809734,
    longitude: -98.555618,
    latitudeDelta: 100,
    longitudeDelta: 10,
  };
  it('should render', async () => {
    const navigation = {
      navigate: jest.fn(),
      getParam: jest.fn(),
      goBack: jest.fn(),
    };

    const mock = {
      request: {
        query: GET_CAMPUS_LOCATIONS,
        variables: {
          latitude: undefined,
          longitude: undefined,
        },
      },
      result: {
        data: {
          campuses,
          currentUser: {
            id: 'AuthenticatedUser:123',
            __typename: 'AuthenticatedUser',
            profile: {
              id: 'Person:123',
              __typename: 'Person',
              campus: campuses[3],
            },
          },
        },
      },
    };

    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <Location navigation={navigation} initialRegion={initialRegion} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
