import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import {
    styled,
    BackgroundView,
    H4,
    BodyText,
    PaddedView
} from '@apollosproject/ui-kit'

// Container for the Fields under the 
export const ContentContainer = styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
}))(View)

// Read Only Fields that show on the Profile
const FieldContainer = styled(({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit * 1.5,
    marginVertical: theme.sizing.baseUnit * 0.5,
}))(View)

const StyledBodyText = styled(({ theme }) => ({
    color: theme.colors.darkSecondary
}))(BodyText)

export const ProfileField = ({ title, content }) => {
    const contentLines = typeof content === 'string'
        ? [content]
        : content

    return <FieldContainer>
        <H4>
            {title}
        </H4>
        {contentLines.map((n, i) =>
            <StyledBodyText
                key={`FieldContainer:${title}:${i}`}
            >
                {n}
            </StyledBodyText>
        )}
    </FieldContainer>
}

ProfileField.propTypes = {
    title: PropTypes.string,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(
            PropTypes.string
        )
    ])
}

ProfileField.defaultProps = {
    title: '',
    content: []
}