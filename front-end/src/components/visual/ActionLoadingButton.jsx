import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * A button that shows a loading state when an action is in progress
 * 
 * @param {Object} props
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {function} props.onClick - Function to call when button is clicked
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.loadingText - Text to show when loading
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'danger', etc.)
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {string} props.spinnerVariant - Spinner style variant ('pulse', 'ripple', 'dots', 'circle')
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.type - Button type (submit, button, reset)
 * @returns {JSX.Element} The action button component
 */
const ActionLoadingButton = ({
  isLoading = false,
  onClick,
  className = '',
  children,
  loadingText = 'Loading...',
  variant = 'primary',
  size = 'md', 
  spinnerVariant = 'circle',
  disabled = false,
  type = 'button',
  ...props
}) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-cyan-500 hover:bg-cyan-600 text-white',
    light: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-700',
    'outline-primary': 'bg-transparent border border-blue-500 hover:bg-blue-50 text-blue-600'
  };
  
  // Size styles
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-2.5'
  };
  
  // Spinner color mapping
  const spinnerColorMap = {
    primary: 'light',
    secondary: 'light',
    success: 'light',
    danger: 'light',
    warning: 'light',
    info: 'light',
    light: 'dark',
    dark: 'light',
    outline: 'primary',
    'outline-primary': 'primary'
  };
  
  // Spinner size mapping
  const spinnerSizeMap = {
    sm: 'sm',
    md: 'sm',
    lg: 'md'
  };

  const variantClass = variantClasses[variant] || variantClasses.primary;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = spinnerColorMap[variant] || 'light';
  const spinnerSize = spinnerSizeMap[size] || 'sm';
  
  // Base button classes
  const baseClasses = 'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center';
  
  // Focus ring color based on variant
  const focusRingColor = variant === 'light' ? 'focus:ring-gray-400' : 
                       variant === 'dark' ? 'focus:ring-gray-500' :
                       variant.includes('outline') ? 'focus:ring-gray-300' :
                       `focus:ring-${variant}-500`;
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${focusRingColor} ${className}`}
      onClick={isLoading ? undefined : onClick}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner 
            size={spinnerSize} 
            color={spinnerColor} 
            variant={spinnerVariant} 
            className="mr-2"
          />
          <span>{loadingText}</span>
        </>
      ) : children}
    </button>
  );
};

export default ActionLoadingButton;
