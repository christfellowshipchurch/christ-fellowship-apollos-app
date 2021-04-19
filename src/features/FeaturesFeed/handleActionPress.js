import { FEATURE_FEED_ACTION_MAP } from '@apollosproject/ui-connected';

const ACTION_MAP = {
  ...FEATURE_FEED_ACTION_MAP,
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
