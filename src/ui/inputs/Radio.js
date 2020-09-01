import React from 'react';
import { View } from 'react-native';
import propTypes from 'prop-types';
import { get } from 'lodash';
import {
    Radio,
    RadioButton as CoreRadioButton,
    RadioButtonIndicator as CoreRadioButtonIndicator,
    H5,
    H6,
    styled,
} from '@apollosproject/ui-kit';

const LabelText = styled(
    ({ theme }) => ({
        color: theme.colors.text.secondary,
        backgroundColor: 'transparent',
        paddingVertical: theme.sizing.baseUnit / 4,
    }),
    'FloatingLabel.LabelText'
)(H6);

const StyledRadio = styled(({ theme }) => ({
    marginBottom: theme.sizing.baseUnit,
    flexDirection: 'column',
    alignItems: 'flex-start',
}))(Radio);

const StyledRadioLabel = styled(({ theme }) => ({
    marginLeft: theme.sizing.baseUnit * 0.5,
}))(H5);

const StyledRadioButton = (props) => (
    <CoreRadioButton
        {...props}
        label={() => <StyledRadioLabel>{props.label}</StyledRadioLabel>}
        underline={false}
    />
);

StyledRadioButton.defaultProps = {
    label: '',
};

StyledRadioButton.propTypes = {
    label: propTypes.string,
};

export default (props) => (
    <View>
        <LabelText>{get(props, 'label')}</LabelText>
        <StyledRadio {...props} />
    </View>
);
export const RadioButton = StyledRadioButton;
export const RadioButtonIndicator = CoreRadioButtonIndicator;
