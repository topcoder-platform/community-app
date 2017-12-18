/**
 * <Image> Draft Decorator Component
 * Renders images within the draft component including a popup edit button and modal
 */
import PT from 'prop-types';
import React from 'react';

import Tooltip from 'components/Tooltip';

import EditModal from './EditModal';
import Popup from './Popup';

export default class Image extends React.Component {
  constructor(props) {
    super(props);

    const {
      contentState,
      entityKey,
    } = this.props;

    const {
      triggerModal,
    } = contentState.getEntity(entityKey).getData();

    this.state = {
      showingModal: Boolean(triggerModal),
    };
  }

  render() {
    const {
      children,
      contentState,
      entityKey,
      updateEntityData,
    } = this.props;

    const {
      description,
      size,
      src,
    } = contentState.getEntity(entityKey).getData();

    const popup = (
      <Popup
        onEdit={() => this.setState({ showingModal: true })}
      />
    );

    return (
      <span>
        {
          this.state.showingModal ?
            <EditModal
              size={size}
              src={src}
              onCancel={() => this.setState({ showingModal: false })}
              onSave={(newSrc, newSize) => {
                this.setState({ showingModal: false });
                updateEntityData(entityKey, { src: newSrc, size: newSize });
              }}
            />
            : null
        }
        <Tooltip
          align={{
            offset: [0, 5],
          }}
          content={popup}
          suppressDiv
          trigger={['click', 'hover']}
        >
          <img src={src} alt={description} height={`${size}%`} width={`${size}%`} />
        </Tooltip>
        {children}
      </span>
    );
  }
}

Image.propTypes = {
  contentState: PT.shape().isRequired,
  children: PT.node.isRequired,
  entityKey: PT.string.isRequired,
  updateEntityData: PT.func.isRequired,
};
