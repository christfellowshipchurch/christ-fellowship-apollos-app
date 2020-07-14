import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { H3, H6, styled } from '@apollosproject/ui-kit';

const Header = styled(
    ({ theme }) => ({
        paddingBottom: theme.sizing.baseUnit * 0.25,
    }),
    'HorizontalFeatureFeed.Header'
)(View);

/* TODO: Change to H5 and add appropriate padding. We are using H6 here to be consistant with other
 * "card titles" (`ActionListFeature`). */
const Title = styled(
    ({ theme }) => ({
        color: theme.colors.text.tertiary,
    }),
    'HorizontalFeatureFeed.Title'
)(H6);

const Subtitle = styled({}, 'HorizontalFeatureFeed.Subtitle')(H6);
const Container = styled(
    ({ theme }) => ({
        paddingHorizontal: theme.sizing.baseUnit * 0.5,
    }),
    'HorizontalFeatureFeed.Container'
)(View);

const HoriztonalFeatureFeed = ({
    isLoading,
    title,
    subtitle,
    Component,
    ...props
}) => (
        <Container>
            {(isLoading || title || subtitle) && ( // only display the Header if we are loading or have a title/subtitle
                <Header>
                    {(isLoading || title) && (
                        <Title numberOfLines={1} bold>
                            {title}
                        </Title>
                    )}
                    {!isLoading &&
                        subtitle && <Subtitle numberOfLines={1}>{subtitle}</Subtitle>}
                </Header>
            )}
            <Component {...props} />
        </Container>
    );

HoriztonalFeatureFeed.propTypes = {
    Component: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.object,
    ]),
    title: PropTypes.string,
    subtitle: PropTypes.string,
    isLoading: PropTypes.bool,
};

HoriztonalFeatureFeed.propTypes = {
    Component: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.object,
    ]),
    isLoading: false,
};

HoriztonalFeatureFeed.defaultProps = {};

export default HoriztonalFeatureFeed;
