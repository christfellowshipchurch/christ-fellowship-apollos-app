import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import Color from 'color';

import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import { styled } from '@apollosproject/ui-kit';

import { FeaturesFeedConnected, FeaturesHeaderConnected } from 'features';

import Wordmark from 'ui/Wordmark';
import { HorizontalDivider } from 'ui/Dividers';
import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../../navigation';

const ListHeaderSpacer = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(View);

const StyledHorizontalDivider = styled(({ theme }) => ({
  width: '100%',
  marginVertical: theme.sizing.baseUnit,
}))(HorizontalDivider);

const Home = ({ navigation }) => {
  const { scrollY } = useHeaderScrollEffect({ navigation });
  const handleOnPress = ({ openUrl }) => ({ action, relatedNode }) => {
    if (action === 'READ_CONTENT') {
      navigation.navigate('ContentSingle', {
        itemId: relatedNode.id,
        transitionKey: 2,
      });
    }
    if (action === 'READ_EVENT') {
      navigation.navigate('Event', {
        eventId: relatedNode.id,
        transitionKey: 2,
      });
    }
    if (action === 'OPEN_URL') {
      openUrl(relatedNode.url);
    }
  };

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <SafeAreaView>
            <FeaturesFeedConnected
              onPressActionItem={handleOnPress({ openUrl })}
              ListHeaderComponent={
                <ListHeaderSpacer>
                  <NavigationSpacer />
                  <FeaturesHeaderConnected />
                  <StyledHorizontalDivider />
                </ListHeaderSpacer>
              }
              scrollEventThrottle={16}
              onScroll={Animated.event([
                {
                  nativeEvent: {
                    contentOffset: { y: scrollY },
                  },
                },
              ])}
              removeClippedSubviews={false}
              numColumns={1}
            />
          </SafeAreaView>
        </BackgroundView>
      )}
    </RockAuthedWebBrowser>
  );
};

// const Home = ({ navigation }) => {
//   const { loading, error, data, refetch } = useQuery(GET_FEED_FEATURES, {
//     fetchPolicy: 'cache-and-network',
//   });
//   const { scrollY } = useHeaderScrollEffect({ navigation });
//   const content = mapDataToActions(get(data, 'userFeedFeatures', []));
//   const renderItem = ({ item }) => {
//     if (item.isLoading)
//       return (
//         <>
//           <HighlightCard title="" isLoading coverImage={[]} />
//           <HorizontalDivider />
//         </>
//       );

//     return item.action ? (
//       <>
//         <Feature {...item} isLoading={loading} />
//         <HorizontalDivider />
//       </>
//     ) : null;
//   };

//   return (
//     <BackgroundView>
//       <SafeAreaView forceInset={{ bottom: 'never', top: 'always' }}>
//         <StatusBar />
//         <FeedView
//           renderItem={renderItem}
//           content={content}
//           isLoading={loading && !get(data, 'userFeedFeatures', []).length}
//           error={error}
//           refetch={refetch}
//           ListHeaderComponent={
//             <React.Fragment>
//               <NavigationSpacer />
//               <FeaturesHeaderConnected />
//             </React.Fragment>
//           }
//           scrollEventThrottle={16}
//           onScroll={Animated.event([
//             {
//               nativeEvent: {
//                 contentOffset: { y: scrollY },
//               },
//             },
//           ])}
//           removeClippedSubviews={false}
//           numColumns={1}
//         />
//       </SafeAreaView>
//     </BackgroundView>
//   );
// };

Home.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    headerTitle: <Wordmark />,
    title: 'Home',
  });

Home.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Home;
