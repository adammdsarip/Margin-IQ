/**
 * Minimal line icon set (24px grid, 1.5 stroke). Add new glyphs to PATHS.
 */
const PATHS = {
  service: (
    <>
      <rect x="3" y="7" width="18" height="13" />
      <path d="M8.5 7V4h7v3" />
      <path d="M3 12.5h18" />
      <path d="M10.5 12.5v2h3v-2" />
    </>
  ),
  product: (
    <>
      <path d="M12 3 20.5 7.5v9L12 21l-8.5-4.5v-9L12 3Z" />
      <path d="M3.5 7.5 12 12l8.5-4.5" />
      <path d="M12 12v9" />
      <path d="m7.75 5.25 8.5 4.5" />
    </>
  ),
  package: (
    <>
      <rect x="3.5" y="5" width="17" height="15" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4M16 3v4" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  subscription: (
    <>
      <path d="M19.5 12a7.5 7.5 0 0 1-13.2 4.9" />
      <path d="M4.5 12a7.5 7.5 0 0 1 13.2-4.9" />
      <path d="M18 3.5v3.75h-3.75" />
      <path d="M6 20.5v-3.75h3.75" />
    </>
  ),
  leads: (
    <>
      <path d="M3.5 4.5h17l-6.5 8v6l-4 2v-8l-6.5-8Z" />
    </>
  ),
  building: (
    <>
      <path d="M4 20.5V4h10v16.5" />
      <path d="M14 9h6v11.5" />
      <path d="M2.5 20.5h19" />
      <path d="M7.5 8h3M7.5 12h3M7.5 16h3M17 13v.01M17 16.5v.01" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  'chevron-right': <path d="m9.5 6 6 6-6 6" />,
  'arrow-right': <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  'arrow-left': <path d="M19.5 12h-15M10.5 6l-6 6 6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
};

export default function Icon({ name, size = 20, className, title }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  );
}
