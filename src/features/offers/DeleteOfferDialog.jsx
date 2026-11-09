import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import '../../components/form/Form.css';

export default function DeleteOfferDialog({ offer, onCancel, onConfirm }) {
  return (
    <Modal
      open={Boolean(offer)}
      onClose={onCancel}
      title="Delete this offer?"
      description={offer ? `"${offer.name}" and its assumptions will be removed from this business. This can't be undone.` : ''}
    >
      <div className="form__actions">
        <Button variant="secondary" onClick={onCancel} autoFocus>Keep offer</Button>
        <Button variant="danger" iconLeft="trash" onClick={onConfirm}>Delete offer</Button>
      </div>
    </Modal>
  );
}
