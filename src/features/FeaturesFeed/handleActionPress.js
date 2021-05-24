import { FEATURE_FEED_ACTION_MAP } from '@apollosproject/ui-connected';

const ACTION_MAP = {
  ...FEATURE_FEED_ACTION_MAP,
  READ_CONTENT: ({ navigation, relatedNode }) => {
    navigation.push('ContentSingle', {
      itemId: relatedNode.id,
      transitionKey: 2,
    });
  },
  READ_GROUP: ({ navigation, relatedNode }) => {
    navigation.navigate('GroupSingle', {
      itemId: relatedNode.id,
      transitionKey: 2,
    });
  },
  READ_PRAYER: ({ navigation, relatedNode }) => {
    navigation.navigate('PrayerRequestSingle', {
      itemId: relatedNode.id,
      transitionKey: 2,
    });
  },
  OPEN_CHANNEL: ({ relatedNode, navigation }) => {
    navigation.navigate('ContentFeed', {
      itemId: relatedNode.id,
      itemTitle: relatedNode.name ?? relatedNode.title ?? 'All Content',
    });
  },
};

export default ({ action, ...props }) => {
  if (ACTION_MAP[action]) {
    try {
      ACTION_MAP[action]({ action, ...props });
    } catch (e) {
      console.log({ e });
    }
  }
};
