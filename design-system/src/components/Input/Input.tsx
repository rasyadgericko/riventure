import React from 'react';
import './Input.css';

export interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  optional = false,
  error,
  value,
  onChange,
}) => {
  const id = `input-${name}`;
  return (
    <div className="ryc-field">
      <label className="ryc-label" htmlFor={id}>
        {label}
        {optional && <span className="ryc-label-optional"> (optional)</span>}
      </label>
      <input
        className={`ryc-input${error ? ' ryc-input--error' : ''}`}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={name}
      />
      {error && <span className="ryc-field-error">{error}</span>}
    </div>
  );
};
