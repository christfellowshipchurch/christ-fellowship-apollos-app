import { Platform, Share } from 'react-native';
import share from '../share';

jest.mock('Platform');
jest.mock('Share');

describe('the share function', () => {
  beforeAll(() => {
    Share.share = jest.fn();
  });
  test('default arguments', () => {
    Platform.OS = 'ios';
    share({ title: 'title', url: 'http://url.com' });
    expect(Share.share).toBeCalledWith({
      title: 'title',
      message: undefined,
      url: 'http://url.com',
    });
  });
  test('use message if provided', () => {
    Platform.OS = 'ios';
    share({ title: 'title', message: 'some message', url: 'http://url.com' });
    expect(Share.share).toBeCalledWith({
      title: 'title',
      message: 'some message',
      url: 'http://url.com',
    });
  });
  test('android arguments', () => {
    Platform.OS = 'android';
    share({ title: 'title', url: 'http://url.com' });
    expect(Share.share).toBeCalledWith({
      title: 'title',
      message: 'http://url.com',
      url: 'http://url.com',
    });
  });
});
