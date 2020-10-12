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
