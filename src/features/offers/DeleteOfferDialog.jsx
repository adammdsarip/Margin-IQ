import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';

export default function DeleteOfferDialog({ offer, costCount = 0, onCancel, onConfirm }) {
  const costs = costCount === 1 ? '1 offer-level cost' : `${costCount} offer-level costs`;
  return (
    <ConfirmDialog
      open={Boolean(offer)}
      title="Delete this offer?"
      description={
        offer
          ? `"${offer.name}"${costCount ? ` and its ${costs}` : ''} will be removed from this business. This can't be undone.`
          : ''
      }
      cancelLabel="Keep offer"
      confirmLabel="Delete offer"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
