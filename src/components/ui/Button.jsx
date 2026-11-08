import Icon from './Icon.jsx';
import './Button.css';

/**
 * variant: 'primary' | 'secondary' | 'ghost'
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  block = false,
  className = '',
  children,
  type = 'button',
  ...props
}) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, block && 'btn--block', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={classes} {...props}>
      {iconLeft && <Icon name={iconLeft} size={18} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={18} />}
    </button>
  );
}
