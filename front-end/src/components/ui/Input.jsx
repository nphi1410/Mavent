import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Input component
 */
const Input = forwardRef(({
  type = 'text',
  label,
  name,
  id,
  value,
  onChange,
  onBlur,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  className = '',
  fullWidth = true,
  ...props
}, ref) => {
  // Generate a random ID if none is provided
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        name={name}
        id={inputId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} 
          rounded-md shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} 
          focus:border-transparent
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          ${fullWidth ? 'w-full' : ''}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Input;
