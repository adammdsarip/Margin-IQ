import Modal from './Modal.jsx';
import Button from './Button.jsx';
import '../form/Form.css';

/** Confirmation for destructive actions. Open when `open` is true. */
export default function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel = 'Cancel', onCancel, onConfirm }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} description={description}>
      <div className="form__actions">
        <Button variant="secondary" onClick={onCancel} autoFocus>{cancelLabel}</Button>
        <Button variant="danger" iconLeft="trash" onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
