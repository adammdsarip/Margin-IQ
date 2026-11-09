import { useSyncExternalStore } from 'react';
import { getToast, subscribeToast } from './toast.js';
import Icon from './Icon.jsx';
import './Toast.css';

export default function Toast() {
  const toast = useSyncExternalStore(subscribeToast, getToast, () => null);
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className="toast">
          <Icon name="check" size={16} />
          {toast.message}
        </div>
      )}
    </div>
  );
}
