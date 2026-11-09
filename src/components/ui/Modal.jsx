import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import './Modal.css';

/** Accessible modal built on the native <dialog> element. */
export default function Modal({ open, onClose, title, description, size, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`modal${size === 'lg' ? ' modal--lg' : ''}`}
      aria-labelledby="modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="modal__panel">
          <header className="modal__header">
            <div>
              <h2 id="modal-title" className="modal__title">{title}</h2>
              {description && <p className="modal__description">{description}</p>}
            </div>
            <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
              <Icon name="close" size={18} />
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}
