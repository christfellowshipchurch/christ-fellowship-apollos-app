jest.mock('react-native-config', () => ({
  ONE_SIGNAL_KEY: 'doesntmatter',
}));
jest.mock('react-native-custom-tabs', () => ({
  CustomTabs: {
    openURL: jest.fn(),
  },
}));
jest.mock('Animated', () => {
  const ActualAnimated = require.requireActual('Animated');
  return {
    ...ActualAnimated,
    timing: (value, config) => ({
      start: (callback) => {
        value.setValue(config.toValue);
        callback && callback();
      },
      stop: () => ({}),
    }),
    spring: (value, config) => ({
      start: (callback) => {
        value.setValue(config.toValue);
        callback && callback();
      },
      stop: () => ({}),
    }),
  };
});

jest.mock('react-native-safari-view', () => ({
  isAvailable: jest.fn().mockImplementation(() => Promise.resolve(true)),
  show: jest.fn(),
}));

jest.mock('react-native-onesignal', () => ({
  getPermissionSubscriptionState: (callback) =>
    callback({ notificationsEnabled: true, subscriptionEnabled: true }),
  promptForPushNotificationsWithUserResponse: (callback) => callback(true),
  init: jest.fn(),
  addEventListener: jest.fn(),
  configure: jest.fn(),
}));

jest.mock('react-native-music-control', () => ({
  enableBackgroundMode: jest.fn(),
  enableControl: jest.fn(),
  on: jest.fn(),
  setNowPlaying: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getUniqueID: () => 'id-123',
  getSystemVersion: () => 'sys-version-123',
  getModel: () => 'ios',
  getVersion: () => 'version-123',
  getBuildNumber: () => 0,
}));

jest.mock('rn-fetch-blob', () => 'Fetch');
jest.mock(
  '@apollosproject/ui-passes/node_modules/rn-fetch-blob',
  () => 'Fetch'
);

jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsConsumer: ({ children }) => children({ test: jest.fn() }),
  AnalyticsProvider: ({ children }) => children,
}));

jest.mock('react-native-video', () => 'Video');

jest.mock('NativeEventEmitter');

jest.mock('react-native-maps');
jest.mock('DatePickerIOS', () => 'DatePicker');
jest.mock('./src/client/index');
