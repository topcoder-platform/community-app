import React from 'react';
import { mount } from 'enzyme';
import { Modal as KitModal } from 'topcoder-react-ui-kit';
import { Modal as UtilsModal } from 'topcoder-react-utils';
import { ThemeProvider } from 'react-css-super-themr';
import 'utils/modal-theme';
import theme from 'styles/modal.scss';

describe('Community App modal defaults', () => {
  it('extends the same shared Modal, preserving custom layouts under nested themes', () => {
    expect(KitModal).toBe(UtilsModal);
    const wrapper = mount(
      <ThemeProvider theme={{}}>
        <KitModal theme={{ container: 'custom-layout', overlay: 'custom-backdrop' }}>
          <span>Modal contents</span>
        </KitModal>
      </ThemeProvider>,
    );
    const container = document.querySelector('.custom-layout');
    expect(container.classList.contains(theme.container)).toBe(true);
    expect(document.querySelector('.custom-backdrop').classList.contains(theme.overlay)).toBe(true);
    wrapper.unmount();
  });
});
