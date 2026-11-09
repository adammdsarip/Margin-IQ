import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { TextInput } from '../../components/form/Controls.jsx';

/** Rename, add and delete a business's cost categories. */
export default function CategoryManager({ categories, costs, onSave, onDelete, onDone }) {
  const [names, setNames] = useState(() => Object.fromEntries(categories.map((c) => [c.id, c.name])));
  const [newName, setNewName] = useState('');
  const [confirming, setConfirming] = useState(null);
  const fallback = categories.find((c) => c.locked);
  const usage = (id) => costs.filter((c) => c.categoryId === id).length;

  const commit = (cat) => {
    const name = (names[cat.id] ?? '').trim();
    if (name && name !== cat.name) onSave({ id: cat.id, profileId: cat.profileId, name });
    else setNames((n) => ({ ...n, [cat.id]: cat.name }));
  };

  const add = () => {
    const name = newName.trim();
    if (!name) return;
    const id = onSave({ profileId: categories[0]?.profileId, name });
    setNames((n) => ({ ...n, [id]: name }));
    setNewName('');
  };

  return (
    <div className="category-manager">
      <ul className="category-list">
        {categories.map((cat) => {
          const used = usage(cat.id);
          return (
            <li key={cat.id} className="category-list__item">
              <div className="category-list__field">
                <label className="visually-hidden" htmlFor={`cat-${cat.id}`}>Category name</label>
                <TextInput
                  id={`cat-${cat.id}`}
                  value={names[cat.id] ?? cat.name}
                  maxLength={40}
                  onChange={(e) => setNames((n) => ({ ...n, [cat.id]: e.target.value }))}
                  onBlur={() => commit(cat)}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                />
                <span className="category-list__usage">{used === 1 ? '1 cost' : `${used} costs`}</span>
              </div>
              {cat.locked ? (
                <span className="category-list__locked" title="Costs from deleted categories move here">Fallback</span>
              ) : confirming === cat.id ? (
                <div className="category-list__confirm">
                  <Button size="sm" variant="danger" onClick={() => { onDelete(cat.id); setConfirming(null); }}>
                    Delete
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>Keep</Button>
                </div>
              ) : (
                <button type="button" className="icon-btn icon-btn--danger" aria-label={`Delete category ${cat.name}`} onClick={() => setConfirming(cat.id)}>
                  <Icon name="trash" size={17} />
                </button>
              )}
              {confirming === cat.id && used > 0 && (
                <p className="category-list__warning">
                  {used === 1 ? '1 cost' : `${used} costs`} will move to "{fallback?.name}".
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="inline-add">
        <div className="field">
          <label className="field__label" htmlFor="new-category">Add a category</label>
          <TextInput
            id="new-category"
            value={newName}
            maxLength={40}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                add();
              }
            }}
            placeholder="e.g. Permits & licences"
          />
        </div>
        <Button variant="secondary" iconLeft="plus" onClick={add} disabled={!newName.trim()}>Add</Button>
      </div>

      <div className="form__actions">
        <Button onClick={onDone}>Done</Button>
      </div>
    </div>
  );
}
