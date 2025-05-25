import React from 'react';
import { classNames } from '../utils';

const Input = ({ 
  className, 
  type = "text", 
  ...props 
}) => {
  return (
    <input
      type={type}
      className={classNames(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

export { Input };
export default Input;
