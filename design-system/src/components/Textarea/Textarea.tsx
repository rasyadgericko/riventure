import React from 'react';
import './Textarea.css';
import '../Input/Input.css';

export interface TextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  name,
  placeholder,
  required = false,
  value,
  onChange,
}) => {
  const id = `textarea-${name}`;
  return (
    <div className="ryc-field">
      <label className="ryc-label" htmlFor={id}>{label}</label>
      <textarea
        className="ryc-textarea"
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
