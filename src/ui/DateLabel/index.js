import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { H6, styled } from '@apollosproject/ui-kit';

const DefaultDateLabelComponent = styled(({ theme }) => ({
    textTransform: 'uppercase',
    color: theme.colors.text.tertiary,
}))(H6);

const DateLabel = ({ date, isTodayText, Component, isLoading, ...props }) => {
    const mDate = moment(date);
    if (!mDate.isValid()) return null;

    const now = moment();
    let displayText = '';

    /** If the date is today, display the isTodayText */
    if (mDate.format('MMDDYYYY') === now.format('MMDDYYYY')) {
        displayText = isTodayText;
    } else if (mDate.week() === now.week()) {
        /** If the date is within this week: Monday */
        displayText = mDate.format('dddd');
    } else if (mDate.year() < now.year()) {
        /** If the date is outside of this year: Jan 1, 1996 */
        displayText = mDate.format('MMM DD, YYYY');
    } else {
        /** If the date is within this year: January 1 */
        displayText = mDate.format('MMMM DD');
    }

    return (
        <Component isLoading={isLoading} {...props}>
            {displayText}
        </Component>
    );
};

DateLabel.propTypes = {
    date: PropTypes.string.isRequired,
    isTodayText: PropTypes.string,
    Component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    isLoading: PropTypes.bool,
};

DateLabel.defaultProps = {
    isTodayText: 'Today',
    Component: DefaultDateLabelComponent,
    isLoading: false,
};

DateLabel.displayName = 'DateLabel';

export default DateLabel;
