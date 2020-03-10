import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import PropTypes from 'prop-types';

import { BackgroundView } from '@apollosproject/ui-kit';
import ProfileHeader from '../ProfileHeader';
import EditUserProfile from '../EditUserProfile';

import { ContentContainer, ProfileField } from '../components';

const UserProfile = ({
    firstName,
    lastName,
    photo,
    campus,
    fields,
    edit: editMode,
    onSave,
    onEdit,
    states,
    ...profileProps
}) => {
    const [editValues, setEditValues] = useState({});

    return (
        <BackgroundView>
            <StatusBar barStyle="light-content" />
            <ProfileHeader
                firstName={firstName}
                lastName={lastName}
                avatar={photo}
                featuredImage={campus.featuredImage}
                campus={campus.name}
                onEdit={onEdit}
                onSave={onSave}
            >
                {editMode ? (
                    <EditUserProfile
                        onValueChange={(values) => setEditValues(values)}
                        defaultValues={profileProps}
                        states={states}
                    />
                ) : (
                        <ContentContainer>
                            {fields.map((n, i) => (
                                <ProfileField
                                    key={`UserProfileField:${i}`}
                                    title={n.title}
                                    content={n.content}
                                />
                            ))}
                        </ContentContainer>
                    )}
            </ProfileHeader>
        </BackgroundView>
    );
};

UserProfile.defaultProps = {
    firstName: '',
    lastName: '',
    photo: {
        uri: '',
    },
    campus: {
        name: '',
        featuredImage: {
            uri: '',
        },
    },
    fields: [],
    edit: false,
    onSave: () => true,
    states: [],
};

UserProfile.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photo: PropTypes.shape({
        uri: PropTypes.string,
    }),
    campus: PropTypes.shape({
        name: PropTypes.string,
        featuredImage: PropTypes.shape({
            uri: PropTypes.string,
        }),
    }),
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            content: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.arrayOf(PropTypes.string),
            ]),
        })
    ),
    edit: PropTypes.bool,
    onSave: PropTypes.func,
    states: PropTypes.array,
};

export default UserProfile;
