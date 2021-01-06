import { FEATURE_FEED_ACTION_MAP } from '@apollosproject/ui-connected';
import { useLinkRouter } from 'hooks';

const ACTION_MAP = {
  ...FEATURE_FEED_ACTION_MAP,
  OPEN_URL: ({ relatedNode }) => {
    const { routeLink } = useLinkRouter();
    routeLink(relatedNode.url, { nested: true });
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
};

export default ({ action, ...props }) => {
  if (ACTION_MAP[action]) {
    ACTION_MAP[action]({ action, ...props });
  }
};
