import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { withProps } from 'recompose';
import { SafeAreaView } from 'react-navigation';
import {
    BackgroundView,
    H3,
    FeedView,
    styled,
    CenteredView,
    withMediaQuery,
} from '@apollosproject/ui-kit';

import ThemeMixin from 'ui/DynamicThemeMixin';
import { HorizontalDivider } from 'ui/Dividers';
import NotificationAlert from './NotificationAlert';
import { DateLabel, Title, Subtitle, Content } from './styles';

const Spacer = styled(({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit,
}))(View);

const StyledHorizontalDivider = styled(({ theme }) => ({
    width: '100%',
}))(HorizontalDivider);

const StyledH3 = styled(({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit,
    ...Platform.select({
        android: {
            paddingTop: theme.sizing.baseUnit,
        },
    }),
}))(H3);

const NotificationPreview = ({ title, subtitle, body, date, isLoading }) => (
    <View>
        <DateLabel date={date} isLoading={isLoading} />
        <Title isLoading={isLoading}>{title}</Title>
        <Subtitle ellipsizeMode="tail" numberOfLines={1} isLoading={isLoading}>
            {subtitle}
        </Subtitle>
        <Content ellipsizeMode="tail" numberOfLines={2} isLoading={isLoading}>
            {body}
        </Content>
    </View>
);

NotificationPreview.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    body: PropTypes.string,
    date: PropTypes.string,
    isLoading: PropTypes.bool,
};

const ListEmptyComponent = () => (
    <CenteredView>
        <Subtitle padded>You're all caught up!</Subtitle>
    </CenteredView>
);

const StyledFeedView = withMediaQuery(
    ({ md }) => ({ maxWidth: md }),
    withProps(({ hasContent, isLoading }) => ({
        numColumns: 1,
    })),
    withProps(({ hasContent, isLoading }) => ({
        numColumns: 2,
    }))
)(FeedView);

const NotificationList = ({ notifications, isLoading }) => {
    const [activeNotification, setActiveNotification] = useState(false);

    return (
        <ThemeMixin>
            <BackgroundView>
                <SafeAreaView forceInset={{ top: 'always', bottom: 'never' }}>
                    <NotificationAlert
                        show={!!activeNotification}
                        showProgress={false}
                        onDismiss={() => setActiveNotification(false)}
                        onPressClose={() => setActiveNotification(false)}
                        notification={activeNotification}
                    />
                    <Spacer>
                        <StyledFeedView
                            content={notifications}
                            ListHeaderComponent={<StyledH3>Updates</StyledH3>}
                            ListItemComponent={NotificationPreview}
                            ItemSeparatorComponent={StyledHorizontalDivider}
                            onPressItem={(item) => {
                                if (!item.isLoading) {
                                    setActiveNotification(item);
                                }
                            }}
                            showsVerticalScrollIndicator={false}
                            hasContent={notifications.length > 1}
                            ListEmptyComponent={ListEmptyComponent}
                        />
                    </Spacer>
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
            body: PropTypes.string,
            date: PropTypes.string,
        })
    ),
    isLoading: PropTypes.bool,
};

NotificationList.defaultProps = {
    notifications: [],
    isLoading: false,
};

export default NotificationList;
