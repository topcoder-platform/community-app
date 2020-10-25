import React from 'react';
import PT from 'prop-types';
import Connector from 'components/Editor/Connector';
import { RichUtils } from 'draft-js';
import IconBold from 'assets/images/settings/profile/work/tc-text-16-bold.svg';
import IconBoldActive from 'assets/images/settings/profile/work/tc-text-16-bold-active.svg';
import IconItalic from 'assets/images/settings/profile/work/tc-text-16-italic.svg';
import IconItalicActive from 'assets/images/settings/profile/work/tc-text-16-italic-active.svg';
import IconUnderline from 'assets/images/settings/profile/work/tc-text-16-underline.svg';
import IconUnderlineActive from 'assets/images/settings/profile/work/tc-text-16-underline-active.svg';
import IconListBullet from 'assets/images/settings/profile/work/text-16px_list-bullet.svg';
import IconListBulletActive from 'assets/images/settings/profile/work/text-16px_list-bullet-active.svg';
import IconListNumbers from 'assets/images/settings/profile/work/text-16px_list-numbers.svg';
import IconListNumbersActive from 'assets/images/settings/profile/work/text-16px_list-numbers-active.svg';

import './style.scss';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editor: null,
      bold: false,
      italic: false,
      underline: false,
      unorderedList: false,
      orderedList: false,
      hidden: true,
    };

    this.onClickBoldButton = this.onClickBoldButton.bind(this);
    this.onClickItalicButton = this.onClickItalicButton.bind(this);
    this.onClickUnderlineButton = this.onClickUnderlineButton.bind(this);
    this.onClickUnorderedListButton = this.onClickUnorderedListButton.bind(this);
    this.onClickOrderedListButton = this.onClickOrderedListButton.bind(this);
  }

  componentDidMount() {
    const { connector } = this.props;
    connector.setToolbar(this);
  }

  componentWillReceiveProps(nextProps) {
    const { connector: prevConnector } = this.props;
    const { connector: newConnector } = nextProps;

    if (newConnector !== prevConnector) {
      if (prevConnector) prevConnector.setToolbar(null);
      if (newConnector) newConnector.setToolbar(this);
    }
  }

  componentWillUnmount() {
    const { connector } = this.props;
    connector.setToolbar(null);
  }

  onClickBoldButton(event) {
    event.preventDefault();
    const { editor } = this.state;
    const newStyle = editor.toggleInlineStyle('BOLD');
    this.setState({ bold: newStyle.has('BOLD') });
  }

  onClickItalicButton(event) {
    event.preventDefault();
    const { editor } = this.state;
    const newStyle = editor.toggleInlineStyle('ITALIC');
    this.setState({ italic: newStyle.has('ITALIC') });
  }

  onClickUnderlineButton(event) {
    event.preventDefault();
    const { editor } = this.state;
    const newStyle = editor.toggleInlineStyle('UNDERLINE');
    this.setState({ underline: newStyle.has('UNDERLINE') });
  }

  onClickUnorderedListButton(event) {
    event.preventDefault();
    const { editor, unorderedList: prevUnorderedList } = this.state;
    this.setState({ unorderedList: !prevUnorderedList, orderedList: false }, () => {
      const { unorderedList } = this.state;
      if (unorderedList) {
        editor.applyBlockStyle('unordered-list-item');
      } else {
        editor.applyBlockStyle('unstyled');
      }
    });
  }

  onClickOrderedListButton(event) {
    event.preventDefault();
    const { editor, orderedList: prevOrderedList } = this.state;
    this.setState({ unorderedList: false, orderedList: !prevOrderedList }, () => {
      const { orderedList } = this.state;
      if (orderedList) {
        editor.applyBlockStyle('ordered-list-item');
      } else {
        editor.applyBlockStyle('unstyled');
      }
    });
  }

  onFocusedEditorChanged(newState) {
    const { connector, onEditorChange } = this.props;
    const editor = connector.focusedEditor;
    if (editor) {
      const inlineStyle = newState.getCurrentInlineStyle();
      const block = RichUtils.getCurrentBlockType(newState);
      this.setState({
        editor,
        bold: inlineStyle.has('BOLD'),
        italic: inlineStyle.has('ITALIC'),
        underline: inlineStyle.has('UNDERLINE'),
        unorderedList: block === 'unordered-list-item',
        orderedList: block === 'ordered-list-item',
        hidden: false,
      }, () => {
        onEditorChange(editor);
      });
    } else {
      this.setState({
        bold: false,
        italic: false,
        underline: false,
        unorderedList: false,
        orderedList: false,
        hidden: true,
      });
    }
  }

  render() {
    const {
      hidden,
      bold,
      italic,
      underline,
      orderedList,
      unorderedList,
    } = this.state;

    return (
      <div styleName="container" style={{ display: hidden ? 'none' : 'flex' }}>
        <button type="button" onMouseDown={this.onClickBoldButton}>
          {bold ? <IconBoldActive /> : <IconBold />}
        </button>
        <button type="button" onMouseDown={this.onClickItalicButton}>
          {italic ? <IconItalicActive /> : <IconItalic />}
        </button>
        <button type="button" onMouseDown={this.onClickUnderlineButton}>
          {underline ? <IconUnderlineActive /> : <IconUnderline />}
        </button>
        <span styleName="separator" />
        <button type="button" onMouseDown={this.onClickOrderedListButton}>
          {orderedList ? <IconListNumbersActive /> : <IconListNumbers />}
        </button>
        <button type="button" onMouseDown={this.onClickUnorderedListButton}>
          {unorderedList ? <IconListBulletActive /> : <IconListBullet />}
        </button>
      </div>
    );
  }
}

Toolbar.defaultProps = {
  connector: new Connector(),
  onEditorChange: () => {},
};

Toolbar.propTypes = {
  connector: PT.instanceOf(Connector),
  onEditorChange: PT.func,
};
