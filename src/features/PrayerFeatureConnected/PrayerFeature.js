import React from 'react';
import PropTypes from 'prop-types';

import {
  AvatarList,
  Card,
  CardContent,
  H3,
  H6,
  ImageSourceType,
  styled,
  withIsLoading,
  withTheme,
  ThemeMixin,
} from '@apollosproject/ui-kit';

const AvatarWrapper = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    paddingHorizontal: 0,
    /* Because `CardContent` is passing `paddingVertical` to `PaddedView` we can't set
     * `PaddedView`'s `vertical` prop to false. So we have to define out own padding value here. */
    paddingTop: theme.sizing.baseUnit * 0.2,
    paddingBottom: 0,
  }),
  'ui-prayer.PrayerFeature.AvatarWrapper'
)(CardContent);

const getAvatars = (prayers) =>
  prayers.map((prayer) => ({
    id: prayer.id,
    notification: !prayer.isPrayed,
    source: prayer.requestor?.photo,
  }));

const Header = styled(
  ({ isCard, theme }) => ({
    ...(isCard
      ? {
        paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
      }
      : {
        paddingTop: theme.sizing.baseUnit * 0, // // TODO: refactor CardContent to have this be the default
      }),
    /* Because `CardContent` is passing `paddingVertical` to `PaddedView` we can't set
     * `PaddedView`'s `vertical` prop to false. So we have to define out own padding value here. */
    paddingBottom: 0,
  }),
  'ui-prayer.PrayerFeature.Header'
)(CardContent);

const StyledAvatarList = withTheme(
  ({ isCard, theme }) => ({
    contentContainerStyle: {
      // flexGrow: 1,
      paddingLeft: isCard ? theme.sizing.baseUnit * 1.5 : theme.sizing.baseUnit, // if this is a card render padding we would expect from `CardContent`
      paddingRight: isCard
        ? theme.sizing.baseUnit // equivalent `CardContent` padding the remaining `0.5 baseUnit` is the `padding` between `the renderItem`s. Total `1.5 baseUnit`
        : theme.sizing.baseUnit * 0.5, // the remaining `baseUnit * 0.5` is the `padding` between `the renderItem`s Total `1 baseUnit`
    },
  }),
  'ui-prayer.PrayerFeature.StyledAvatarList'
)(AvatarList);

/* TODO: Change to H5 and add appropriate padding. We are using H6 here to be consistant with other
 * "card titles" (`ActionListFeature`). */
const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-prayer.PrayerFeature.Title'
)(H6);

const Subtitle = styled({}, 'ui-prayer.PrayerFeature.Subtitle')(H3);

const RenderAsCard = ({ children, isCard, isLoading }) =>
  isCard ? <Card isLoading={isLoading}>{children}</Card> : children;

RenderAsCard.propTypes = {
  isCard: PropTypes.bool,
  isLoading: PropTypes.bool,
  children: PropTypes.node,
};

const PrayerFeature = ({
  prayers = [],
  isCard,
  isLoading,
  onPressAdd,
  onPressAvatar,
  title,
  subtitle,
  theme,
}) => (
    <ThemeMixin mixin={{ colors: { secondary: theme.colors.primary } }}>
      <RenderAsCard isCard={isCard} isLoading={isLoading}>
        {isLoading || title || subtitle ? ( // only display the Header if we are loading or have a title/subtitle
          <Header isCard={isCard}>
            {!isLoading && title ? ( // we check for isloading here so that they are included in the loading state
              <Title numberOfLines={1}>{title}</Title>
            ) : null}
            {/* {isLoading || subtitle ? <Subtitle>{subtitle}</Subtitle> : null} */}
          </Header>
        ) : null}
        <AvatarWrapper>
          <StyledAvatarList
            avatars={getAvatars(prayers)}
            isCard={isCard}
            isLoading={isLoading}
            onPressAdd={onPressAdd}
            onPressAvatar={onPressAvatar}
          />
        </AvatarWrapper>
      </RenderAsCard>
    </ThemeMixin>
  );

PrayerFeature.propTypes = {
  prayers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      isPrayed: PropTypes.bool,
      requestor: PropTypes.shape({
        photo: ImageSourceType,
      }),
    })
  ).isRequired,
  isCard: PropTypes.bool,
  isLoading: PropTypes.bool,
  onPressAdd: PropTypes.func,
  onPressAvatar: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

PrayerFeature.defaultProps = {
  isCard: false,
  subtitle: 'Prayer',
};

export default withTheme()(withIsLoading(PrayerFeature));
