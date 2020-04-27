import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query, ApolloConsumer } from 'react-apollo';
import Color from 'color';

import {
    TouchableScale,
    PaddedView,
    Avatar,
    styled,
    BodyText,
    Icon,
} from '@apollosproject/ui-kit';
import { GET_USER_PHOTO } from './queries';
import uploadPhoto from './uploadPhoto';

const Overlay = styled(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: Color(theme.colors.black)
        .alpha(theme.alpha.low)
        .string(),
    borderRadius: theme.sizing.avatar.large / 2,
}))(View);

const GetPhotoData = ({ children }) => (
    <Query query={GET_USER_PHOTO}>
        {({ data: { currentUser = {} } = {} }) => {
            const photo = get(currentUser, 'profile.photo');
            return children({ photo });
        }}
    </Query>
);

GetPhotoData.propTypes = {
    children: PropTypes.func.isRequired,
};

const Wrapper = styled({
    justifyContent: 'center',
    alignItems: 'center',
})(View);

export default class AvatarForm extends PureComponent {
    state = {
        isUploadingFile: false,
    };

    componentWillUnmount() {
        this.setState({ isUploadingFile: false });
    }

    handleUploadPhoto = async ({ client }) => {
        try {
            await uploadPhoto({
                client,
                onUpload: () => this.setState({ isUploadingFile: true }),
            });
            await this.setState({ isUploadingFile: false });
        } catch (e) {
            console.warn(e);
            this.setState({ isUploadingFile: false });
        }
    };

    render() {
        const { isUploadingFile } = this.state;

        return (
            <ApolloConsumer>
                {(client) => (
                    <Wrapper>
                        <GetPhotoData>
                            {({ photo }) => (
                                <PaddedView horizontal={false}>
                                    <TouchableScale
                                        onPress={() => this.handleUploadPhoto({ client })}
                                    >
                                        <Avatar
                                            source={photo}
                                            size="large"
                                            isLoading={isUploadingFile}
                                        />
                                        <Overlay>
                                            <Icon name="camera" fill="white" size={24} />
                                            <BodyText>Update</BodyText>
                                        </Overlay>
                                    </TouchableScale>
                                </PaddedView>
                            )}
                        </GetPhotoData>
                    </Wrapper>
                )}
            </ApolloConsumer>
        );
    }
}
