import React from 'react';
import PropTypes from 'prop-types';
import Color from 'color';

import { View, StyleSheet } from 'react-native';
import {
    withTheme,
    styled,
    H3,
    TouchableScale,
    ButtonLink,
    FlexedView,
} from '@apollosproject/ui-kit';

const RowHeader = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
    paddingHorizontal: theme.sizing.baseUnit,
    marginBottom: theme.sizing.baseUnit * 0.25,
}))(View);

const Title = withTheme(({ theme, color }) => ({
    style: {
        color: theme.colors[color],
    },
}))(H3);

const AndroidTouchableFix = withTheme(({ theme }) => ({
    width: '25%',
    borderRadius: theme.sizing.baseUnit / 2,
}))(TouchableScale);

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

export const SectionHeader = ({ title, color, onPress, callToAction }) => (
    <RowHeader>
        <View style={{ width: '75%' }}>
            <Title color={color}>{title}</Title>
        </View>
        {!!onPress && (
            <AndroidTouchableFix onPress={onPress}>
                <ButtonLinkSpacing>
                    <StyledButtonLink>{callToAction}</StyledButtonLink>
                </ButtonLinkSpacing>
            </AndroidTouchableFix>
        )}
    </RowHeader>
);

SectionHeader.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    color: PropTypes.string,
    callToAction: PropTypes.string,
};

SectionHeader.defaultProps = {
    onPress: null,
    callToAction: 'See All',
};

const ActionDivider = styled(({ theme }) => ({
    height: StyleSheet.hairlineWidth,
    backgroundColor: Color(
        Color(theme.colors.screen).isLight()
            ? theme.colors.black
            : theme.colors.white
    ).fade(0.1),
    opacity: 0.5,
    width: '70%',
    marginVertical: theme.sizing.baseUnit * 2,
}))(View);

const ActionContainer = ({ children }) => (
    <FlexedView style={{ alignItems: 'center' }}>
        <View style={{ flex: 1 }}>{children}</View>
        <ActionDivider />
    </FlexedView>
);

export const ActionWrapper = ActionContainer;
