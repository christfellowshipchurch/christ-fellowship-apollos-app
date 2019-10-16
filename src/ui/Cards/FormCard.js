import React from 'react'
import {
    FlexedView,
    Card, CardContent,
    ActivityIndicator,
    H4,
    styled
} from '@apollosproject/ui-kit'

const Overlay = styled(() => ({
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, .75)',
    top: 0,
    left: 0,
    zIndex: 1
}))(FlexedView)

export default ({ title, children, isLoading }) => (
    <Card>
        <CardContent>
            <FormCardTitle>{title}</FormCardTitle>
            {isLoading
                ? (<Overlay>
                    <ActivityIndicator />
                </Overlay>)
                : children}
        </CardContent>
    </Card>
)

const FormCardTitle = styled(({ theme }) => ({
    paddingTop: theme.sizing.baseUnit * 0.5,
    paddingBottom: theme.sizing.baseUnit,
}))(H4)