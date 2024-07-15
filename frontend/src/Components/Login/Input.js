import React from 'react';

const Input = ({ id, type, label,required, disabled, onChange }) => (
    <input className="form-group__input" type={type} id={id} placeholder={label} required={required} disabled={disabled} onChange={onChange} />
);

export default Input;
