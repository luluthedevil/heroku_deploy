import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

function Input({
  inputType, placeholder, value, setValue,
}) {
  return (
    <div className="wrap-input">
      <input
        className={value !== '' ? 'has-val input' : 'input'}
        type={inputType}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span className="focus-input" data-placeholder={placeholder} />
    </div>
  );
}

Input.propTypes = {
  inputType: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default Input;
