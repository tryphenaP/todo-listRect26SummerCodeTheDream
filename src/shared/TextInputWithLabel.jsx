import styles from './TextInputWithLabel.module.css';

function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
  maxLength,
  placeholder,
  required = false,
  disabled = false,
  type = 'text',
  ...restProps
}) {
  return (
    <div className={styles.inputGroup}>
      <label
        htmlFor={elementId}
        className={styles.label}
      >
        {labelText}
        {required && <span aria-hidden="true" style={{ color: 'var(--color-danger)', marginLeft: '4px' }}>*</span>}
      </label>

      <input
        type={type}
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={styles.input}
        {...restProps}
      />
    </div>
  );
}

export default TextInputWithLabel;