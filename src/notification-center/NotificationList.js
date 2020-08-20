import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    BackgroundView,
    H3,
    PaddedView,
    FeedView,
    styled,
} from '@apollosproject/ui-kit';

import ThemeMixin from 'ui/DynamicThemeMixin';
import NotificationAlert from './NotificationAlert';
import { DateLabel, Title, Subtitle, Content } from './styles';

const BorderedView = styled(({ theme }) => ({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.text.tertiary,
    paddingBottom: theme.sizing.baseUnit,
}))(View);

const NotificationPreview = ({ title, subtitle, content, date }) => (
    <PaddedView>
        <BorderedView>
            <DateLabel date={date} />
            <Title>{title}</Title>
            <Subtitle ellipsizeMode="tail" numberOfLines={1}>
                {subtitle}
            </Subtitle>
            <Content ellipsizeMode="tail" numberOfLines={2}>
                {content}
            </Content>
        </BorderedView>
    </PaddedView>
);

NotificationPreview.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.string,
};

const NotificationList = ({ notifications }) => {
    const [activeNotification, setActiveNotification] = useState(false);
    return (
        <ThemeMixin>
            <BackgroundView>
                <SafeAreaView forceInset={{ top: 'always', bottom: 'never' }}>
                    <NotificationAlert
                        show={activeNotification}
                        showProgress={false}
                        onDismiss={() => setActiveNotification(false)}
                        onPressClose={() => setActiveNotification(false)}
                        notification={activeNotification}
                    />
                    <FeedView
                        content={notifications}
                        ListHeaderComponent={
                            <PaddedView>
                                <H3>Updates</H3>
                            </PaddedView>
                        }
                        ListItemComponent={NotificationPreview}
                        onPressItem={(item) => {
                            setActiveNotification(item);
                        }}
                    />
                </SafeAreaView>
            </BackgroundView>
        </ThemeMixin>
    );
};

NotificationList.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            subtitle: PropTypes.string,
            content: PropTypes.string,
            date: PropTypes.string,
        })
    ),
};

NotificationList.propTypes = {
    notifications: [],
};

export default NotificationList;
