import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { compose, withProps } from 'recompose';
import {
    styled,
    Button,
    withTheme,
    Icon,
    H2,
    H5,
    H6,
    Radio,
    DateInput
} from '@apollosproject/ui-kit';

const FlexedSafeAreaView = compose(
    styled({ flex: 1 }, 'ui-auth.FlexedSafeAreaView'),
    withProps({ forceInset: { top: 'always' } })
)(SafeAreaView);

const BrandIcon = withTheme(({ theme }) => ({
    name: 'brand-icon',
    size: theme.sizing.baseUnit * 3.0,
    fill: theme.colors.primary,
    marginBottom: theme.sizing.baseUnit,
}))(Icon);

const TitleText = styled(
    ({ theme }) => ({
        color: theme.colors.primary,
    }),
    'ui-auth.TitleText'
)(H2);

const PromptText = styled(
    ({ theme }) => ({
        color: theme.colors.text.secondary,
    }),
    'ui-auth.PromptText'
)(H5);

const NextButton = styled({}, 'ui-auth.NextButton')((props) => (
    <Button type={'primary'} pill={false} {...props} />
));

const StyledRadio = styled(({ theme }) => ({
    marginBottom: theme.sizing.baseUnit,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
}))(Radio);

const RadioLabel = styled(({ theme }) => ({
    marginLeft: theme.sizing.baseUnit * 0.5,
}))(H5);

const Label = styled(({ theme, padded }) => ({
    color: 'gray',
    opacity: 0.7,
    ...(padded ? { marginTop: theme.sizing.baseUnit } : {}),
}))(H6);

const StyledDate = styled(({ theme }) => ({
    marginTop: 0,
    marginBottom: theme.sizing.baseUnit,
}))(DateInput);

export { FlexedSafeAreaView, BrandIcon, TitleText, PromptText, NextButton, StyledRadio, RadioLabel, Label, StyledDate };
