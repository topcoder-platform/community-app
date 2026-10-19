/**
 * Extend the shared Modal defaults once for every Community App modal.
 * Reapplying themr with the same component name extends its existing theme in
 * place, preserving the shared component and each screen's layout overrides.
 */
import { Modal } from 'topcoder-react-ui-kit';
import { themr } from 'react-css-super-themr';
import theme from 'styles/modal.scss';

themr('Modal', theme)(Modal);
