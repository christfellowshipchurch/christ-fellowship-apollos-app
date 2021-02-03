import React, { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

import {
  styled,
  BackgroundView,
  PaddedView,
  ImageSourceType,
} from '@apollosproject/ui-kit';

import CoverImageBackground from '../CoverImageBackground';
import Resources from '../Resources';
import { HorizontalMembersFeedPreview } from '../MembersFeed';
import HeaderConnected from '../HeaderConnected';
import SummaryConnected from '../SummaryConnected';
import { CheckInButtonConnected } from '../../check-in';

const Cell = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
  flexDirection: 'row',
  justifyContent: 'space-between',
  flex: 1,
}))(View);

const VolunteerGroup = ({ id, content, loading }) => {
  const navigation = useNavigation();
  const checkInRef = useRef();
  const coverImageSources = get(content, 'coverImage.sources', []);
  const resources = get(content, 'resources', []);

  return (
    <CoverImageBackground isLoading={loading} source={coverImageSources}>
      <HeaderConnected id={id} />

      <BackgroundView>
        <PaddedView vertical={false}>
          <Cell>
            <View />
            <CheckInButtonConnected id={id} ref={checkInRef} />
          </Cell>

          <SummaryConnected id={id} />
        </PaddedView>

        <HorizontalMembersFeedPreview id={id} />

        {!isEmpty(resources) ? (
          <Resources
            isLoading={loading}
            navigation={navigation}
            resources={resources}
          />
        ) : null}
      </BackgroundView>
    </CoverImageBackground>
  );
};

VolunteerGroup.propTypes = {
  id: PropTypes.string,
  content: PropTypes.shape({
    __typename: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
    groupType: PropTypes.string,
    groupResources: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        action: PropTypes.string,
        relatedNode: PropTypes.shape({ id: PropTypes.string }),
      })
    ),
    coverImage: ImageSourceType,
  }),
  loading: PropTypes.bool,
};

export default VolunteerGroup;
