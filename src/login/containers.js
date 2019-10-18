import React from 'react'
import {
    KeyboardAvoidingView,
    StyleSheet,
    ScrollView,
    Image,
    View
} from 'react-native'
import { filter } from 'lodash'
import {
    FlexedView,
    PaddedView,
    Button,
    styled,
    H3,
    BodySmall
} from '@apollosproject/ui-kit'

import {
    FlexedSafeAreaView,
    FlexedFooter,
} from './styles.js'

const HeaderImage = styled({
    resizeMode: 'contain',
    height: '50%',
})(Image)

const FlexedContent = styled(({ theme }) => ({
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.sizing.baseUnit,
}))(View)

const FlexedBody = styled(({ theme }) => ({
    flex: 5,
    padding: theme.sizing.baseUnit * 0.5,
}))(View)

const StyledBodySmall = styled(({ theme }) => ({
    textAlign: 'center',
    paddingVertical: theme.sizing.baseUnit * 0.25
}))(BodySmall)

const TextContainer = styled(({ theme }) => ({
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: theme.sizing.baseUnit,
}))(FlexedView)

const ChildrenContainer = styled(({ theme }) => ({
    flexDirection: 'column',
    padding: theme.sizing.baseUnit,
}))(FlexedView)

const PaddedFlexView = styled(({ theme }) => ({
    flexDirection: 'column',
    paddingHorizontal: theme.sizing.baseUnit,
    alignItems: 'stretch'
}))(FlexedView)

const TestBlock = () => <View style={{ height: 100, backgroundColor: 'red' }}></View>

export const SubmitButton = ({ buttonProps }) => {
    return (
        <FlexedFooter>
            <PaddedView>
                <Button {...buttonProps} />
            </PaddedView>
        </FlexedFooter>
    )
}

export const Container = ({ children, title, description }) => (

    <FlexedView style={{
        flexDirection: 'column',
        backgroundColor: 'white',
        ...StyleSheet.absoluteFill,
        backgroundColor: 'white'
    }}>
        <FlexedContent style={{ justifyContent: 'flex-end' }}>
            <HeaderImage source={require('./header.png')} />
        </FlexedContent>

        <FlexedBody>
            <KeyboardAvoidingView behavior={'padding'}>
                <ScrollView>
                    <FlexedView style={{ flexDirection: 'column' }}>
                        <TextContainer>
                            <H3 padded>{title}</H3>
                            {Array.isArray(description)
                                ? description.map((n, i) => <StyledBodySmall key={i}>{n}</StyledBodySmall>)
                                : <StyledBodySmall>{description}</StyledBodySmall>}
                        </TextContainer>

                        <PaddedFlexView>
                            {filter(children, (n) => n && n.type !== Container.Footer)}
                        </PaddedFlexView>
                    </FlexedView>
                </ScrollView>
            </KeyboardAvoidingView>
        </FlexedBody>

        <FlexedContent style={{ justifyContent: 'flex-start' }}>
            {filter(children, (n) => n && n.type === Container.Footer)}
        </FlexedContent>
    </FlexedView>
)

Container.Footer = ({ children }) => <PaddedFlexView>{children}</PaddedFlexView>

export const FormFields = ({ children }) => (<ChildrenContainer>{children}</ChildrenContainer>)