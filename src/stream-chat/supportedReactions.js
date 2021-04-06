import React from 'react';
import {
  RootPath,
  RootSvg,
  LoveReaction,
  ThumbsUpReaction,
  WutReaction,
  LOLReaction,
} from 'stream-chat-react-native';

const FireIcon = (props) => (
  <RootSvg width="24" height="24" viewBox="0 0 24 24" fill="#00aeef" {...props}>
    <RootPath
      fill="none"
      d="M12 22C9.28002 22 4.57002 19.33 4.05002 14.99C3.69002 11.95 5.51002 9.6 6.01002 8.99C6.42002 11.1 7.53002 12.7 8.95002 12.99C9.21002 13.04 9.54002 13.06 9.93002 12.99C9.82002 10.67 10 6.33 12.86 3C13.17 2.63 13.66 2.3 14 2C14.24 4.64 14.98 6.12 15.8 7C16.91 8.19 18.59 9 19.48 11.28C19.52 11.37 19.63 11.65 19.72 12C20.34 14.38 20.04 17.88 17.76 19.99C15.85 21.76 13.35 22 13 22C12.49 22 12.56 22 12 22Z"
      undefined="2"
      {...props}
    />
    <RootPath
      fill="none"
      d="M14 16C12.96 17.04 11.41 17.43 10 17C11.13 18.09 12.7 18.5 14 18C16.01 17.24 16.83 14.54 16 13C15.74 12.53 15.36 12.21 15 12C15.43 13.41 15.04 14.96 14 16Z"
      undefined="2"
      {...props}
    />
    <RootPath
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke-miterlimit="10"
      stroke-width="2"
      d="M14 16C12.96 17.04 11.41 17.43 10 17C11.13 18.09 12.7 18.5 14 18C16.01 17.24 16.83 14.54 16 13C15.74 12.53 15.36 12.21 15 12C15.43 13.41 15.04 14.96 14 16Z"
      {...props}
    />
  </RootSvg>
);

export default [
  {
    type: 'love',
    Icon: ThumbsUpReaction,
  },
  {
    type: 'haha',
    Icon: LOLReaction,
  },
  {
    type: 'fire',
    Icon: FireIcon,
  },
  {
    type: 'pray',
    Icon: LoveReaction,
  },
  {
    type: 'wow',
    Icon: WutReaction,
  },
];