import React from 'react'
import {
    ScrollView,
    Dimensions,
} from 'react-native'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

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
    TouchableScale
} from '@apollosproject/ui-kit'

import { withNavigation } from 'react-navigation'

const FlexedScrollView = styled({ flex: 1 })(ScrollView)

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
}))(GradientOverlayImage)

const FlexedViewCenterColumns = styled(({ theme }) => ({
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}))(FlexedView)

const ProfileContainer = styled(({ theme }) => ({
    width: '100%',
    height: Dimensions.get('window').width * 1.1,
    position: 'absolute',
    top: 0,
    left: 0,
    padding: theme.sizing.baseUnit * 2,
}))(FlexedViewCenterColumns)

const ProfileName = styled(({ theme }) => ({
    marginTop: theme.sizing.baseUnit * 0.5
}))(H3)

const CampusName = styled(({ theme }) => ({
    fontWeight: 'normal',
    fontSize: 14,
}))(BodyText)

const EditButton = styled(({ theme }) => ({
    borderColor: theme.colors.white,
    borderRadius: 3,
    borderWidth: 1,
    fontSize: 12,
    paddingHorizontal: 25,
    fontWeight: 'bold',
    marginVertical: theme.sizing.baseUnit
}))(BodyText)

const ProfileHeader = ({
    firstName,
    lastName,
    featuredImage,
    avatar,
    campus,
    navigation,
    children
}) => {

    return (
        <StretchyView>
            {({ Stretchy, ...scrollViewProps }) => (
                <FlexedScrollView {...scrollViewProps}>
                    {!!avatar && (
                        <Stretchy>
                            <FeaturedImage
                                source={featuredImage}
                            />
                        </Stretchy>
                    )}
                    <ProfileContainer>
                        <ThemeMixin mixin={{ type: 'dark' }}>
                            <FlexedView
                                style={{
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    width: '100%'
                                }}
                            >
                                <Touchable onPress={() => navigation.navigate('UserSettings')}>
                                    <FontAwesomeIcon icon={['fal', "cog"]} fill={'white'} size={24} />
                                </Touchable>
                            </FlexedView>

                            <FlexedViewCenterColumns style={{ flex: 3 }}>
                                <Avatar
                                    source={avatar}
                                    size="large"
                                />

                                <ProfileName>
                                    {`${firstName} ${lastName}`}
                                </ProfileName>

                                <CampusName>
                                    {campus}
                                </CampusName>

                                <TouchableScale>
                                    <EditButton>
                                        Edit Profile
                                    </EditButton>
                                </TouchableScale>
                            </FlexedViewCenterColumns>

                        </ThemeMixin>
                    </ProfileContainer>
                    {children}
                </FlexedScrollView>
            )}
        </StretchyView>
    )
}

ProfileHeader.defaultProps = {
    firstName: '',
    lastName: '',
    avatar: {
        uri: '',
    },
    featuredImage: {
        uri: '',
    },
    campus: ''
}

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
}

export default withNavigation(ProfileHeader)
