import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import ReactImageFallback from 'react-image-fallback';
import Modal from 'components/Modal';
import Left from 'assets/images/ico-arrow-big-left.svg';
import Right from 'assets/images/ico-arrow-big-right.svg';
import NoImage from 'assets/images/card-bg-no-image.png';
import style from './style.scss';

class GalleryModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { selected: 0 };
    this.onLeft = this.onLeft.bind(this);
    this.onRight = this.onRight.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    const { challenge } = this.props;
    this.length = challenge.userDetails.submissions.length;
    this.images = _.map(challenge.userDetails.submissions, sub => sub.submissionImage.full);
  }

  onLeft() {
    const { selected } = this.state;
    this.setState({ selected: ((selected + this.length) - 1) % this.length });
  }

  onRight() {
    const { selected } = this.state;
    this.setState({ selected: (selected + 1) % this.length });
  }

  onSelect(index) {
    this.setState({ selected: index });
  }

  render() {
    const { onCancel, challenge } = this.props;
    const { selected } = this.state;
    return (
      <Modal onCancel={onCancel} theme={style}>
        <div styleName="lightbox-container">
          {this.length > 1
            && (
            <div styleName="left-nav" onClick={this.onLeft} role="presentation">
              <Left />
            </div>
            )
          }
          <div styleName="selector">
            <div styleName="title">
              {challenge.name}
            </div>
            <ReactImageFallback
              initialImage={NoImage}
              src={this.images[selected]}
              fallbackImage={NoImage}
            />
            <div styleName="info">
              {selected + 1}
              {' '}
of
              {' '}
              {this.length}
            </div>
            <div styleName="selections">
              {this.images.map((item, index) => {
                const selectable = index === selected ? 'selection current' : 'selection';
                return (
                  <span key={`gallery-img-${item}`} onClick={_.partial(this.onSelect, index)} role="presentation">
                    <ReactImageFallback
                      initialImage={NoImage}
                      src={this.images[index]}
                      fallbackImage={NoImage}
                      styleName={selectable}
                    />
                  </span>
                );
              })}
            </div>
          </div>
          {this.length > 1
            && (
            <div styleName="right-nav" onClick={this.onRight} role="presentation">
              <Right />
            </div>
            )
          }
        </div>
      </Modal>
    );
  }
}

GalleryModal.propTypes = {
  onCancel: PT.func.isRequired,
  challenge: PT.shape().isRequired,
};

export default GalleryModal;
