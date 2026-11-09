/** Settings-style section: title and guidance on the left, fields on the right. */
export default function FormSection({ title, description, children }) {
  return (
    <section className="form-section">
      <div className="form-section__intro">
        <h2 className="form-section__title">{title}</h2>
        {description && <p className="form-section__description">{description}</p>}
      </div>
      <div className="form-section__fields">{children}</div>
    </section>
  );
}
