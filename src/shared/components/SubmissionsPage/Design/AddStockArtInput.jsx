import React from 'react';
import './input.scss';

/**
 * Add Stock Art part shown on Submission Page of design challenges.
 */
class AddStockArt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlCorrect: true,
    };
    this.onInputUrl = this.onInputUrl.bind(this);
  }

  onInputUrl(e) {
    if (e.target.value.match(/[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/)) {
      this.setState({
        urlCorrect: true,
      });
    } else if (!e.target.value) {
      this.setState({
        urlCorrect: true,
      });
    } else {
      this.setState({
        urlCorrect: false,
      });
    }
  }

  render() {
    return (
      <div styleName="container">
        <span styleName="desc">PHOTO DESCRIPTION</span>
        <input type="text" data-type="photoDesc" />
        <span styleName="desc">PHOTO URL</span>
        <input type="text" data-type="photoUrl" onChange={this.onInputUrl} />
        <p styleName={`error ${!this.state.urlCorrect ? 'show' : ''}`}>
          This is not a correct url.
        </p>
        <span styleName="desc">FILE NUMBER</span>
        <input type="text" data-type="photoNumber" />
        <div styleName="separator" />
      </div>
    );
  }
}

export default AddStockArt;
