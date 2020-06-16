import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
    Touchable,
    ButtonLink,
    H3,
    styled,
    withTheme,
} from '@apollosproject/ui-kit';

const RowHeader = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
    paddingHorizontal: theme.sizing.baseUnit,
    marginBottom: theme.sizing.baseUnit * 0.25,
}))(View);

const AndroidTouchableFix = withTheme(({ theme }) => ({
    width: '25%',
    borderRadius: theme.sizing.baseUnit / 2,
}))(Touchable);

const ButtonLinkSpacing = styled(({ theme }) => ({
    flexDirection: 'row', // correctly positions the loading state
    justifyContent: 'flex-end', // correctly positions the loading state
    padding: theme.sizing.baseUnit, // UX hack to improve tapability.
    marginBottom: theme.sizing.baseUnit * -1 + 3,
    marginRight: theme.sizing.baseUnit * -1,
}))(View);

const StyledButtonLink = styled(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.colors.lightTertiary,
    fontSize: 12,
}))(ButtonLink);

const FeedHeader = ({ title, onPress, seeMoreText, seeMore, isLoading }) => (
    <RowHeader>
        <View style={{ width: seeMore ? '75%' : '100%' }}>
            <H3 isLoading={isLoading}>{title}</H3>
        </View>
        {seeMore &&
            !isLoading && (
                <AndroidTouchableFix onPress={onPress}>
                    <ButtonLinkSpacing>
                        <StyledButtonLink>{seeMoreText}</StyledButtonLink>
                    </ButtonLinkSpacing>
                </AndroidTouchableFix>
            )}
    </RowHeader>
);

FeedHeader.propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    seeMoreText: PropTypes.string,
    seeMore: PropTypes.bool,
    isLoading: PropTypes.bool,
};

FeedHeader.defaultProps = {
    onPress: () => null,
    seeMoreText: 'See more',
    seeMore: true,
    isLoading: false,
};

export default FeedHeader;
