import React from 'react'
import PropTypes from 'prop-types'

import { View } from 'react-native'
import {
    withTheme,
    styled,
    H2,
    H3,
    TouchableScale,
    ButtonLink,
    ContentCard
} from '@apollosproject/ui-kit'

const RowHeader = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
    paddingHorizontal: theme.sizing.baseUnit,
    // marginTop: theme.sizing.baseUnit * 1.5,
}))(View)

const Title = withTheme(({ theme, color }) => ({
    style: {
        color: theme.colors[color],
    }
}))(H3)

const AndroidTouchableFix = withTheme(({ theme }) => ({
    width: '25%',
    borderRadius: theme.sizing.baseUnit / 2,
}))(TouchableScale)

const ButtonLinkSpacing = styled(({ theme }) => ({
    flexDirection: 'row', // correctly positions the loading state
    justifyContent: 'flex-end', // correctly positions the loading state
    padding: theme.sizing.baseUnit, // UX hack to improve tapability.
    marginBottom: (theme.sizing.baseUnit) * -1 + 3,
    marginRight: (theme.sizing.baseUnit) * -1
}))(View)

const StyledButtonLink = styled(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.colors.lightTertiary,
    fontSize: 12
}))(ButtonLink)

export const SectionHeader = ({ title, color, onPress, callToAction }) => {
    return <RowHeader>
        <View style={{ width: '75%' }}>
            <Title color={color}>
                {title}
            </Title>
        </View>
        {!!onPress && <AndroidTouchableFix onPress={onPress} >
            <ButtonLinkSpacing>
                <StyledButtonLink>
                    {callToAction}
                </StyledButtonLink>
            </ButtonLinkSpacing>
        </AndroidTouchableFix>}
    </RowHeader>
}

SectionHeader.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    color: PropTypes.string,
    callToAction: PropTypes.string,
}

SectionHeader.defaultProps = {
    onPress: null,
    callToAction: 'See All'
}

export const ActionWrapper = styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit * 2,
    borderBottomColor: theme.colors.lightSecondary,
    borderBottomWidth: 1,
}))(View)