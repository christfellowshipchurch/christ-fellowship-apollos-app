import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    FlexedView,
    Touchable,
    H4,
    styled,
} from '@apollosproject/ui-kit'

const PaddedRow = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.sizing.baseUnit
}))(FlexedView)

const Cell = ({ title, icon, onPress }) => (
    <Touchable
        onPress={onPress}
    >
        <PaddedRow>
            <FontAwesomeIcon icon={icon} size={24} />
            <H4 style={{ flex: 4, paddingLeft: 10 }}>{title}</H4>
            <FontAwesomeIcon icon={['fal', 'angle-right']} size={24} />
        </PaddedRow>
    </Touchable>
)

Cell.defaultProps = {
    icon: ['fal', 'link'],
    title: 'Cell Title',
    onPress: () => { }
}

export default Cell