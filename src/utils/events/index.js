import moment from 'moment';
import { get } from 'lodash';

export const formatDate = (props) => {
    const mStart = moment(get(props, 'startDate', new Date()));
    let mEnd = null;
    const end = get(props, 'endDate', null);

    if (end) {
        mEnd = moment(end);
        const format = mStart.month() === mEnd.month() ? 'D' : 'MMM D';

        return `${mStart.format('MMM D')} - ${mEnd.format(format)}`;
    }

    return mStart.format('MMM D');
};

export const getStartDateFromEvents = (props) => {
    const events = get(props, 'events', []);
    const start = get(props, 'startDate', new Date());
    const mStart = moment(start).isValid() ? start : new Date();
    const sorted = events.sort((a, b) => moment(a.start).diff(moment(b.start)));

    return moment(get(sorted, '[0].start', mStart)).format('MMM D');
};
