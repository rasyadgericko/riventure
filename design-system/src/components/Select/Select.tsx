import React from 'react';
import './Select.css';
import '../Input/Input.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  name,
  options = [],
  placeholder = 'Select an option',
  required = false,
  value,
  onChange,
}) => {
  const id = `select-${name}`;
  return (
    <div className="ryc-field">
      <label className="ryc-label" htmlFor={id}>{label}</label>
      <select
        className="ryc-select"
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};
