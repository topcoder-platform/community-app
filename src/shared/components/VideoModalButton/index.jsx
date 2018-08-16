/**
 * Renders "Watch video" button that opens a video modal and shows specified
 * video when clicked. This component spawned from Veterans community banner,
 * and it should be further improved to be truly reusable in different places
 * (where the different theming is necessary).
 */

import Modal from 'components/Modal';
import PT from 'prop-types';
import React from 'react';
import YouTubeVideo from 'components/YouTubeVideo';

import { Button } from 'topcoder-react-utils';

import style from './style.scss';

export default class VideoModalButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const { videoTitle, videoUrl } = this.props;
    const { open } = this.state;
    return (
      <React.Fragment>
        {
          open ? (
            <Modal
              onCancel={() => this.setState({ open: false })}
              theme={{
                container: style.whatIsTopcoderVideo,
              }}
            >
              <YouTubeVideo
                autoplay
                src={videoUrl}
                title={videoTitle}
              />
              <div
                onClick={() => this.setState({ open: false })}
                onKeyPress={() => this.setState({ open: false })}
                role="button"
                styleName="closeWhatIsTopcoderVideoCross"
                tabIndex={0}
              >
                &times;
              </div>
            </Modal>
          ) : null
        }
        <Button
          onClick={() => this.setState({ open: true })}
          theme={{
            button: style.watchVideoButton,
          }}
        >
          &#9658;&emsp;Watch video
        </Button>
      </React.Fragment>
    );
  }
}

VideoModalButton.defaultProps = {
  videoTitle: '',
};

VideoModalButton.propTypes = {
  videoTitle: PT.string,
  videoUrl: PT.string.isRequired,
};
