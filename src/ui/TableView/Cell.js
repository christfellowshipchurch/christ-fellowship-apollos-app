import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    FlexedView,
    Touchable,
    H5,
    styled,
    withTheme,
} from '@apollosproject/ui-kit';

const PaddedRow = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.sizing.baseUnit * 0.75,
    paddingHorizontal: theme.sizing.baseUnit,
}))(FlexedView);

const Title = styled(({ theme }) => ({
    flex: 4,
    fontWeight: 'normal',
}))(H5);

const Icon = withTheme(({ theme }) => ({
    color: theme.colors.darkSecondary,
    style: {
        marginRight: theme.sizing.baseUnit * 0.5,
    },
}))(FontAwesomeIcon);

const Cell = ({ title, icon, onPress }) => (
    <Touchable onPress={onPress}>
        <PaddedRow>
            {!!icon && icon !== '' && <Icon icon={['fal', icon]} size={16} />}
            <Title>{title}</Title>
            <Icon icon={['fal', 'angle-right']} size={24} />
        </PaddedRow>
    </Touchable>
);

Cell.defaultProps = {
    icon: null,
    title: 'Cell Title',
    onPress: () => { },
};

export default Cell;
