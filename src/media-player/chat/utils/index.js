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
    id: 'haha',
    icon: '😂',
  },
  {
    id: 'wow',
    icon: '😮',
  },
  {
    id: 'sad',
    icon: '😔',
  },
  {
    id: 'angry',
    icon: '😠',
  },
];

export const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const MESSAGE_ACTIONS = {
  edit: 'edit',
  delete: 'delete',
  reactions: 'reactions',
  reply: 'reply',
};
