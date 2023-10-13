import React, { useEffect, useState, useRef } from 'react';
import PT from 'prop-types';
import { isImage, isVideo } from 'utils/url';
import BtnPlay from 'assets/images/button_play_video.svg';
import cn from 'classnames';


import './styles.scss';

function getVideoCover(file, seekTo = 0.0) {
  return new Promise((resolve) => {
    // load the file to a video player
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('src', URL.createObjectURL(file));
    videoPlayer.load();
    videoPlayer.addEventListener('error', () => {
      resolve('');
    });
    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener('loadedmetadata', () => {
      // seek to user defined timestamp (in seconds) if possible
      if (videoPlayer.duration < seekTo) {
        resolve('');
        return;
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener('seeked', () => {
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement('canvas');
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        // draw the video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        const thumnail = canvas.toDataURL('image/jpeg', 0.75);
        resolve(thumnail);
      });
    });
  });
}

function PhotoVideoItem({
  className, onClick, file, notSelectable, url, isUrlPhoto, videoThumnailUrl,
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [isThisVideo, setIsThisVideo] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  useEffect(() => {
    if (file && isImage(file.name)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isMounted.current) {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else if (file && isVideo(file.name)) {
      setIsThisVideo(true);
      getVideoCover(file).then((videoUrl) => {
        if (isMounted.current) {
          setImageUrl(videoUrl);
        }
      });
    }
  }, [file]);

  useEffect(() => {
    if (url) {
      if (isUrlPhoto) {
        setImageUrl(url);
        setIsThisVideo(false);
      } else {
        setImageUrl(videoThumnailUrl);
        setIsThisVideo(true);
      }
    }
  }, [url]);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      className={className}
      styleName={cn('container', {
        'not-selectable': notSelectable,
      })}
      type="button"
    >
      {imageUrl && !isThisVideo ? (<img styleName="img-container" src={imageUrl} alt="" />) : null}
      {isThisVideo && (
        <video styleName="video-container">
          <source src={imageUrl} />
          <track kind="captions" />
        </video>
      )}
      {isThisVideo ? (<BtnPlay styleName="btn-play" width="25" height="25" />) : null}
    </button>
  );
}

/**
 * Default values for Props
 */
PhotoVideoItem.defaultProps = {
  className: '',
  onClick: () => { },
  file: null,
  notSelectable: false,
  url: '',
  videoThumnailUrl: '',
  isUrlPhoto: true,
};

/**
 * Prop Validation
 */
PhotoVideoItem.propTypes = {
  className: PT.string,
  onClick: PT.func,
  file: PT.any,
  notSelectable: PT.bool,
  url: PT.string,
  videoThumnailUrl: PT.string,
  isUrlPhoto: PT.bool,
};

export default PhotoVideoItem;
