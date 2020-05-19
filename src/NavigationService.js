import URL from 'url';
import querystring from 'querystring';
import { StackActions, NavigationActions } from 'react-navigation';

let _navigator;

const setTopLevelNavigator = (navigatorRef) => {
  _navigator = navigatorRef;
};

const navigate = (routeName, params) => {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
};

export const resetAction = ({ navigatorName, routeName }) =>
  StackActions.reset({
    index: 0,
    key: null,
    actions: [
      NavigationActions.navigate({
        routeName: navigatorName,
        action: NavigationActions.navigate({
          routeName,
        }),
      }),
    ],
  });

const resetToAuth = () => {
  _navigator.dispatch(
    resetAction({
      // navigatorName: 'Auth',
      // routeName: 'AuthSMSPhoneEntryConnected',
      navigatorName: 'LandingScreen',
      routeName: 'LandingScreen',
    })
  );
};

const goBack = (from) => {
  let key;
  if (from) {
    const route = _navigator.state.nav.routes.find((r) => r.routeName === from);
    if (route) ({ key } = route);
  }
  _navigator.dispatch(NavigationActions.back({ key }));
};

const deepLink = (rawUrl) => {
  if (!rawUrl) return;

  const url = URL.parse(rawUrl);
  const route = url.pathname.substring(1);
  const args = querystring.parse(url.query);

  navigate(route, args);
};

export default {
  setTopLevelNavigator,
  navigate,
  resetAction,
  goBack,
  resetToAuth,
  deepLink,
};
