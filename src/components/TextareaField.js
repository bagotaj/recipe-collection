export default function InputField({
  errors,
  fieldValues,
  handleInputChange,
  handleInputBlur,
  rows,
  cols,
  name,
  labelText,
  required,
  reference,
}) {
  return (
    <div className={`mb-3 ${errors[name] !== '' ? 'was-validated' : ''}`}>
      <label htmlFor={name} className="form-label m-2">
        {labelText}
      </label>
      <textarea
        className="form-control m-2"
        id={name}
        name={name}
        rows={rows}
        cols={cols}
        value={fieldValues[name]}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        required={required}
        ref={reference}
      />
      <div className="invalid-feedback">{errors[name]}</div>
    </div>
  );
}
