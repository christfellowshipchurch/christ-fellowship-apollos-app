import useFeatureFlag from './useFeatureFlag';

const WithFeatureFlag = ({ flag, children }) => {
  const { enabled } = useFeatureFlag({ key: flag });
  return children(enabled);
};

export default WithFeatureFlag;
