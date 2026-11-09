import { useState } from 'react';
import { CLASSIFICATIONS, FREQUENCIES } from '../../data/costSetup.js';
import Button from '../../components/ui/Button.jsx';
import { Select, TextInput } from '../../components/form/Controls.jsx';

export const EMPTY_FILTERS = { search: '', categoryId: '', classification: '', frequency: '' };

export const applyFilters = (costs, f) => {
  const q = f.search.trim().toLowerCase();
  return costs.filter(
    (c) =>
      (!q || c.name.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q)) &&
      (!f.categoryId || c.categoryId === f.categoryId) &&
      (!f.classification || c.classification === f.classification) &&
      (!f.frequency || c.frequency === f.frequency)
  );
};

export default function CostFilters({ filters, onChange, categories }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const all = (label, list) => [{ id: '', label }, ...list];
  const active = ['categoryId', 'classification', 'frequency'].filter((k) => filters[k]).length;
  const [open, setOpen] = useState(active > 0);
  return (
    <div className={`cost-filters${open ? ' is-open' : ''}`} role="search">
      <div className="cost-filters__search">
        <label className="visually-hidden" htmlFor="cost-search">Search costs</label>
        <TextInput id="cost-search" type="search" value={filters.search} onChange={set('search')} placeholder="Search costs" />
      </div>
      <Button variant="secondary" className="cost-filters__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Filters{active ? ` (${active})` : ''}
      </Button>
      <label className="visually-hidden" htmlFor="filter-category">Category</label>
      <Select id="filter-category" value={filters.categoryId} onChange={set('categoryId')} options={all('All categories', categories.map((c) => ({ id: c.id, label: c.name })))} />
      <label className="visually-hidden" htmlFor="filter-class">Classification</label>
      <Select id="filter-class" value={filters.classification} onChange={set('classification')} options={all('All classifications', CLASSIFICATIONS)} />
      <label className="visually-hidden" htmlFor="filter-frequency">Frequency</label>
      <Select id="filter-frequency" value={filters.frequency} onChange={set('frequency')} options={all('All frequencies', FREQUENCIES)} />
    </div>
  );
}
