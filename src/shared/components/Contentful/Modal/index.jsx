/**
 * Renders a Modal with data from Contentful
 */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import Banner from 'components/Contentful/Banner';
import ContentBlock from 'components/Contentful/ContentBlock';
import Viewport from 'components/Contentful/Viewport';
import { Modal } from 'topcoder-react-ui-kit';
import { errors } from 'topcoder-react-lib';
import { themr } from 'react-css-super-themr';
import classnames from 'classnames';

import defaultStyle from './style.scss';

const { fireErrorMessage } = errors;

const COMPONENTS = {
  banner: Banner,
  contentBlock: ContentBlock,
  viewport: Viewport,
};

class ContentfulModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
    };
    this.onPopModal = this.onPopModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.updateMoalStyle = this.updateMoalStyle.bind(this);
    this.dismissButtonRef = null;
  }

  componentDidMount() {
    this.updateMoalStyle();
  }

  componentDidUpdate() {
    this.updateMoalStyle();
  }

  onPopModal() {
    this.setState({
      isOpen: true,
    });
  }

  onCloseModal() {
    this.setState({
      isOpen: false,
    });
  }

  updateMoalStyle() {
    if (this.dismissButtonRef !== null) {
      const modalElement = this.dismissButtonRef.parentElement;
      if (modalElement && !modalElement.style.overflowY) {
        modalElement.style.overflowY = 'auto';
      }
    }
  }

  render() {
    const {
      id,
      children,
      theme,
      preview,
      spaceName,
      environment,
    } = this.props;
    const { isOpen } = this.state;
    const contentfulConfig = {
      preview,
      spaceName,
      environment,
    };
    return (
      <ContentfulLoader
        entryIds={id}
        {...contentfulConfig}
        renderPlaceholder={LoadingIndicator}
        render={(data) => {
          const contentId = _.get(data, `entries.items.${id}.fields.content.sys.id`);
          if (!contentId) return null;
          return (
            <React.Fragment>
              {React.Children.map(children, child => React.cloneElement(child, {
                onClick: (e) => {
                  e.preventDefault();
                  if (child.props.onClick) {
                    child.props.onClick(e);
                  }
                  this.onPopModal(e);
                },
                className: classnames(theme.modalTrigger, child.props.className),
              }))}
              {isOpen && (
              <Modal onCancel={this.onCloseModal}>
                <div
                  className={theme.dismissButton}
                  onClick={this.onCloseModal}
                  onKeyPress={this.onCloseModal}
                  role="button"
                  tabIndex={0}
                  ref={(node) => { this.dismissButtonRef = node; }}
                >
                  &times;
                </div>
                <ContentfulLoader
                  entryIds={contentId}
                  {...contentfulConfig}
                  render={(contentData) => {
                    const contentType = _.get(contentData, `entries.items.${contentId}.sys.contentType.sys.id`);
                    const Component = COMPONENTS[contentType];
                    if (Component) {
                      return (
                        <Component
                          id={contentId}
                          {...contentfulConfig}
                        />
                      );
                    }
                    return fireErrorMessage('Unsupported content type from contentful', '');
                  }}
                />
              </Modal>
              )}
            </React.Fragment>
          );
        }}
      />
    );
  }
}

ContentfulModal.defaultProps = {
  id: null,
  isOpen: false,
  theme: {},
  preview: false,
  spaceName: null,
  environment: null,
};

ContentfulModal.propTypes = {
  id: PT.string,
  isOpen: PT.bool,
  children: PT.node.isRequired,
  theme: PT.shape({
    modalTrigger: PT.string,
    dismissButton: PT.any,
  }),
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};

export default themr('Contentful-Modal', defaultStyle)(ContentfulModal);
