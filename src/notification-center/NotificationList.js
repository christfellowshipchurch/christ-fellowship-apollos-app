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
  FlexedView,
  Card,
  CardContent,
} from '@apollosproject/ui-kit';

import ThemeMixin from 'ui/DynamicThemeMixin';
import { HorizontalDivider } from 'ui/Dividers';
import { CardFeed } from 'ui/CardFeeds';
import NotificationAlert from './NotificationAlert';
import { DateLabel, Title, Subtitle, Content } from './styles';

const Spacer = styled(({ theme, asCard }) => ({
  paddingHorizontal: asCard ? 0 : theme.sizing.baseUnit,
  flex: 1,
}))(View);

const StyledHorizontalDivider = styled(({ theme }) => ({
  width: '100%',
}))(HorizontalDivider);

const StyledH3 = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  paddingBottom: theme.sizing.baseUnit,
  ...Platform.select({
    android: {
      paddingTop: theme.sizing.baseUnit,
    },
  }),
}))(H3);

const NotificationPreview = ({
  title,
  subtitle,
  body,
  date,
  isLoading,
  asCard,
}) => {
  const BodyContent = () => (
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

  return asCard ? (
    <Card>
      <CardContent>
        <BodyContent />
      </CardContent>
    </Card>
  ) : (
    <FlexedView>
      <BodyContent />
    </FlexedView>
  );
};

NotificationPreview.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  body: PropTypes.string,
  date: PropTypes.string,
  isLoading: PropTypes.bool,
  asCard: PropTypes.bool,
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

const StyledSafeAreaView = styled(({ theme }) => ({
  flex: 1,
}))(SafeAreaView);

const NotificationList = ({
  notifications,
  isLoading,
  refetch,
  error,
  asCard,
}) => {
  const [activeNotification, setActiveNotification] = useState(false);
  const ListItemComponent = (props) => (
    <NotificationPreview asCard={asCard} {...props} />
  );

  return (
    <ThemeMixin>
      <BackgroundView>
        <StyledSafeAreaView forceInset={{ top: 'always', bottom: 'never' }}>
          <NotificationAlert
            show={!!activeNotification}
            showProgress={false}
            onDismiss={() => setActiveNotification(false)}
            onPressClose={() => setActiveNotification(false)}
            notification={activeNotification}
          />
          <StyledH3>Updates</StyledH3>
          <Spacer asCard={asCard}>
            <CardFeed
              content={notifications}
              card={ListItemComponent}
              ItemSeparatorComponent={
                asCard ? () => null : StyledHorizontalDivider
              }
              onPressItem={(item) => {
                if (!item.isLoading) {
                  setActiveNotification(item);
                }
              }}
              showsVerticalScrollIndicator={false}
              hasContent={notifications.length > 1}
              ListEmptyComponent={ListEmptyComponent}
              isLoading={isLoading}
              refetch={refetch}
              error={error}
            />
          </Spacer>
        </StyledSafeAreaView>
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
  error: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  refetch: PropTypes.func,
  asCard: PropTypes.bool,
};

NotificationList.defaultProps = {
  notifications: [],
  isLoading: false,
  refetch: () => true,
  asCard: false,
};

export default withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps(() => ({
    asCard: false,
  })),
  withProps(() => ({
    asCard: true,
  }))
)(NotificationList);
