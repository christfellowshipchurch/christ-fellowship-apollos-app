import React, { useState, useEffect } from 'react';
import { ScrollView, Dimensions, View } from 'react-native';
import { SafeAreaView, withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import {
    withTheme,
    styled,
    StretchyView,
    GradientOverlayImage,
    Avatar,
    FlexedView,
    H3,
    BodyText,
    Touchable,
    ThemeMixin,
    TouchableScale,
    H4,
} from '@apollosproject/ui-kit';
import ChangeAvatar from '../ChangeAvatar';

const FlexedScrollView = styled({ flex: 1 })(ScrollView);

const FeaturedImage = withTheme(({ theme }) => ({
    // Sets the ratio of the image
    minAspectRatio: 0.9,
    maxAspectRatio: 0.9,
    // Sets the ratio of the placeholder
    forceRatio: 0.9,
    // No ratios are respected without this
    maintainAspectRatio: true,
    overlayColor: theme.colors.black,
    overlayType: 'gradient-user-profile',
}))(GradientOverlayImage);

const FlexedViewCenterColumns = styled(({ theme }) => ({
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}))(FlexedView);

const ProfileContainer = styled(({ theme }) => ({
    width: '100%',
    height: Dimensions.get('window').width * 1.1,
    position: 'absolute',
    top: 0,
    left: 0,
    padding: theme.sizing.baseUnit,
    marginTop: theme.sizing.baseUnit * 1.5,
}))(View);

const NavigationContainer = styled(({ theme }) => ({
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    padding: theme.sizing.baseUnit * 1.5,
    zIndex: 1000, // ui hack to make sure the navigation is always accessible
}))(SafeAreaView);

const ProfileName = styled(({ theme }) => ({
    marginTop: theme.sizing.baseUnit * 0.5,
}))(H3);

const CampusName = styled(({ theme }) => ({
    fontWeight: 'normal',
    fontSize: 14,
}))(BodyText);

const EditButton = styled(({ theme, editMode, disabled }) => ({
    borderColor: editMode ? theme.colors.primary : theme.colors.white,
    backgroundColor: editMode ? theme.colors.primary : theme.colors.transparent,
    borderRadius: 3,
    borderWidth: 1,
    fontSize: 12,
    paddingHorizontal: 25,
    fontWeight: 'bold',
    marginVertical: theme.sizing.baseUnit,
    opacity: disabled ? 0.5 : 1,
}))(BodyText);

const ProfileHeader = ({
    firstName,
    lastName,
    featuredImage,
    avatar,
    campus,
    navigation,
    children,
    edit: editMode,
    editButtonText,
    onEdit,
    onSave,
    onCancel,
    isLoading,
}) => (
        <StretchyView>
            {({ Stretchy, ...scrollViewProps }) => (
                <FlexedScrollView {...scrollViewProps}>
                    {!!avatar && (
                        <Stretchy>
                            <FeaturedImage source={featuredImage} />
                        </Stretchy>
                    )}
                    <ThemeMixin mixin={{ type: 'dark' }}>
                        <NavigationContainer forceInset={{ bottom: 'always', top: 'always' }}>
                            <FlexedView>
                                {editMode && (
                                    <Touchable onPress={onCancel} disabled={isLoading}>
                                        <BodyText>Cancel</BodyText>
                                    </Touchable>
                                )}
                            </FlexedView>

                            <FlexedView style={{ alignItems: 'center' }}>
                                {editMode && (
                                    <BodyText style={{ fontWeight: 'bold' }}>Edit Profile</BodyText>
                                )}
                            </FlexedView>

                            <FlexedView style={{ alignItems: 'flex-end' }}>
                                {!editMode && (
                                    <Touchable
                                        onPress={() => navigation.navigate('Settings')}
                                        disabled={isLoading}
                                    >
                                        <FontAwesomeIcon
                                            icon={['fal', 'cog']}
                                            fill={'white'}
                                            size={24}
                                        />
                                    </Touchable>
                                )}
                            </FlexedView>
                        </NavigationContainer>

                        <ProfileContainer>
                            <ThemeMixin mixin={{ type: 'dark' }}>
                                <FlexedViewCenterColumns>
                                    {editMode ? (
                                        <ChangeAvatar />
                                    ) : (
                                            <Avatar source={avatar} size="large" />
                                        )}

                                    <ProfileName>{`${firstName} ${lastName}`}</ProfileName>

                                    <CampusName>{campus}</CampusName>

                                    <TouchableScale
                                        onPress={() => {
                                            if (editMode) onSave();
                                            onEdit();
                                        }}
                                        disabled={isLoading}
                                    >
                                        <EditButton editMode={editMode} disabled={isLoading}>
                                            {editButtonText[`${editMode}`]}
                                        </EditButton>
                                    </TouchableScale>
                                </FlexedViewCenterColumns>
                            </ThemeMixin>
                        </ProfileContainer>
                    </ThemeMixin>

                    {children}
                </FlexedScrollView>
            )}
        </StretchyView>
    );

ProfileHeader.defaultProps = {
    firstName: '',
    lastName: '',
    avatar: {
        uri: '',
    },
    featuredImage: {
        uri: '',
    },
    campus: '',
    edit: false,
    editButtonText: {
        true: 'Save',
        false: 'Edit Profile',
    },
    onEdit: () => true,
    onSave: () => true,
    isLoading: false,
};

ProfileHeader.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photo: PropTypes.shape({
        uri: PropTypes.string,
    }),
    campus: PropTypes.string,
    featuredImage: PropTypes.shape({
        uri: PropTypes.string,
    }),
    edit: PropTypes.bool,
    editButtonText: PropTypes.shape({
        true: PropTypes.string,
        false: PropTypes.string,
    }),
    onEdit: PropTypes.func,
    onSave: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default withNavigation(ProfileHeader);
