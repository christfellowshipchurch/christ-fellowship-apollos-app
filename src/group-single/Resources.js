import React from 'react';
import PropTypes from 'prop-types';
import { Button, PaddedView, H4, styled } from '@apollosproject/ui-kit';
import { useLinkRouter } from '../hooks';

const StyledH4 = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(H4);

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit * 0.5,
  backgroundColor: 'rgba(120, 120, 128, 0.36)',
  borderColor: 'rgba(120, 120, 128, 0)',
}))(Button);

const StyledButtonText = styled(() => ({
  color: '#FFF',
}))(H4);

const Resources = ({ resources, isLoading, navigation }) => {
  const { routeLink } = useLinkRouter();
  return (
    <PaddedView>
      <StyledH4>{'Resources'}</StyledH4>
      {resources.map(({ id, contentChannelItem, url, title }) => {
        const handleOnPress = () => {
          if (contentChannelItem) {
            navigation.navigate('ContentSingle', {
              itemId: contentChannelItem,
            });
          }
          return routeLink(url);
        };
        return (
          <StyledButton
            onPress={() => handleOnPress()}
            type={'default'}
            loading={isLoading}
            pill={false}
            key={id}
          >
            <StyledButtonText>{title}</StyledButtonText>
          </StyledButton>
        );
      })}
    </PaddedView>
  );
};

Resources.propTypes = {
  resources: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    contentChannelItem: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

export default Resources;
