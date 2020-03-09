import React from 'react';
import { ButtonLink, Button, styled, H5 } from '@apollosproject/ui-kit';

import { Container } from '../containers';

const CenterAlignedLink = styled(({ theme }) => ({
    textAlign: 'center',
    paddingVertical: theme.sizing.baseUnit,
}))(H5);

const EnableNotificationsForm = ({
    buttonText,
    handleSubmit,
    title,
    description,
    skipButtonText,
    handleSkip,
}) => (
        <Container title={title} description={description}>
            <React.Fragment />
            <Container.Footer>
                <Button title={buttonText} onPress={handleSubmit} />
                <CenterAlignedLink>
                    <ButtonLink onPress={handleSkip}>{skipButtonText}</ButtonLink>
                </CenterAlignedLink>
            </Container.Footer>
        </Container>
    );

EnableNotificationsForm.defaultProps = {
    buttonText: 'Enable Push Notifications',
    skipButtonText: 'I’d prefer not to be contacted',
    title: "Let's stay in touch",
    description:
        'Please let us know the way you prefer to be contacted by Christ Fellowship.',
};

export default EnableNotificationsForm;
