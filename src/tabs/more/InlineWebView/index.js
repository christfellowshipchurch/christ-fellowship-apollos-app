import React, { PureComponent } from 'react';
import { View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import SafeAreaView from 'react-native-safe-area-view';
import { WebView } from 'react-native-webview';
import { styled, BackgroundView } from '@apollosproject/ui-kit';

const InlineWebViewContainer = styled(() => ({
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 0,
}))(View);

class InlineWebView extends PureComponent {
    /** Function for React Navigation to set information in the header. */
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('title'),
    });

    static propTypes = {
        /** Functions passed down from React Navigation to use in navigating to/from
         * items in the feed.
         */
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
            navigate: PropTypes.func,
        }),
    };

    render() {
        const { height, width } = Dimensions.get('window');
        const { navigation } = this.props;

        return (
            <BackgroundView>
                <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
                    <InlineWebViewContainer>
                        <WebView
                            source={{
                                uri: navigation.getParam('uri'),
                            }}
                            style={{ flex: 1, width, height }}
                            scrollEnabled
                        />
                    </InlineWebViewContainer>
                </SafeAreaView>
            </BackgroundView>
        );
    }
}

export default InlineWebView;
