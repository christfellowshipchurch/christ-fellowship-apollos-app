import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import { styled, H3, BodyText } from '@apollosproject/ui-kit';

import GET_CONTENT_ITEM from './getContentItem';

const TitleSpacer = styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit,
}))(View);

const Title = ({ contentId, isLoading }) => {
    const { data, loading } = useQuery(GET_CONTENT_ITEM, {
        variables: { itemId: contentId },
    });

    return (
        <TitleSpacer>
            <H3 isLoading={loading || isLoading}>{get(data, 'node.title', '')}</H3>
            <BodyText isLoading={loading || isLoading}>
                {get(data, 'node.summary', '')}
            </BodyText>
        </TitleSpacer>
    );
};

Title.propTypes = {
    contentId: PropTypes.string,
    isLoading: PropTypes.bool,
};

Title.defaultProps = {
    contentId: '',
    isLoading: false,
};

export default Title;