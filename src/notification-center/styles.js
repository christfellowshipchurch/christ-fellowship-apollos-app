import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { View, StyleSheet } from 'react-native';
import { H4, H5, H6, styled, withTheme, Icon } from '@apollosproject/ui-kit';

const DateText = styled(({ theme }) => ({
    textTransform: 'uppercase',
    color: theme.colors.text.tertiary,
}))(H6);

export const DateLabel = ({ date, isLoading }) =>
    moment(date).isValid() ? (
        <DateText isLoading={isLoading}>
            {moment(date).format(
                moment(date).year() < moment().year() ? 'MMM DD, YYYY' : 'dddd, MMM DD'
            )}
        </DateText>
    ) : null;

DateLabel.propTypes = {
    date: PropTypes.string,
    isLoading: PropTypes.bool,
};

DateLabel.defaultProps = {
    date: moment().format(),
    isLoading: false,
};

export const BorderedView = styled(({ theme }) => ({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.text.tertiary,
    paddingBottom: theme.sizing.baseUnit,
}))(View);

export const Row = styled(({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}))(View);

export const CloseIcon = withTheme(({ theme, name = 'close' }) => ({
    name,
    fill: theme.colors.text.tertiary,
    size: 16,
}))(Icon);

export const Title = styled(({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit * 0.25,
}))(H4);
export const Subtitle = styled(({ theme }) => ({
    color: theme.colors.text.tertiary,
}))(H5);
export const Content = styled(({ theme }) => ({}))(H5);

export const Render = ({ condition, children }) =>
    condition ? children : null;

Render.propTypes = {
    condition: PropTypes.bool,
};
