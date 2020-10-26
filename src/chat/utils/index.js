import { get, isString } from 'lodash';

export renderReactions from './renderReactions';

export const emojiData = [
  {
    id: 'like',
    icon: '👍',
  },
  {
    id: 'love',
    icon: '❤️️',
  },
  {
    id: 'fire',
    icon: '🔥',
  },
  {
    id: 'haha',
    icon: '😂',
  },
  {
    id: 'smile',
    icon: '😊',
  },
  {
    id: 'pray',
    icon: '🙏',
  },
  {
    id: 'highfive',
    icon: '🙌',
  },
];

export const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const stripPrefix = (value) => {
  if (!isString(value) || !value.includes(':')) {
    return value;
  }

  return value.split(':')[1];
};

export const getStreamUser = (user) => {
  const id = stripPrefix(get(user, 'id', ''));
  const firstName = get(user, 'profile.firstName', '');
  const lastName = get(user, 'profile.lastName', '');
  const image = get(user, 'profile.photo.uri');

  return {
    id,
    name: `${firstName} ${lastName}`,
    image,
  };
};
