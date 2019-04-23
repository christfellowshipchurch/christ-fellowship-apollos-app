import React, { Component } from 'react';
import { Query } from 'react-apollo';

import FullscreenPlayer from './FullscreenPlayer';

import { getMediaPlayerVisibility } from './queries';

export { MINI_PLAYER_HEIGHT } from './MiniControls';
export MediaPlayerSpacer from './MediaPlayerSpacer';

/**
 * Selectively renders FullscreenPlayer component is MediaPlayer is visible
 */
class MediaPlayer extends Component {
  shouldComponentUpdate() {
    return false; // 🚀
  }

  renderPlayer = ({ data = {} }) => {
    if (!data.mediaPlayer || !data.mediaPlayer.isVisible) return null;
    return <FullscreenPlayer />;
  };

  render() {
    return <Query query={getMediaPlayerVisibility}>{this.renderPlayer}</Query>;
  }
}

export default MediaPlayer;
