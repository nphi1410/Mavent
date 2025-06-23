import React from 'react';

/**
 * A stylish, customizable loading spinner component
 * 
 * @param {Object} props
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg', 'xl')
 * @param {string} props.color - Color theme ('primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark')
 * @param {boolean} props.overlay - Whether to show the spinner as an overlay
 * @param {string} props.text - Optional loading text to display
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Style variant ('pulse', 'ripple', 'dots', 'circle')
 * @returns {JSX.Element} The loading spinner component
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  overlay = false,
  text = '',
  className = '',
  variant = 'circle'
}) => {
  // Size mapping
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Color mapping
  const colorMap = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-cyan-600',
    light: 'text-gray-300',
    dark: 'text-gray-800'
  };

  // Determine the size and color classes
  const sizeClass = sizeMap[size] || sizeMap.md;
  const colorClass = colorMap[color] || colorMap.primary;

  // Render different spinner variants
  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className={`animate-pulse rounded-full ${sizeClass} ${colorClass} bg-current`}></div>
        );
      case 'ripple':
        return (
          <div className={`${sizeClass} relative`}>
            <div className={`absolute inset-0 rounded-full ${colorClass} opacity-75 animate-ping`}></div>
            <div className={`relative rounded-full ${sizeClass} ${colorClass} opacity-90`}></div>
          </div>
        );
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={`rounded-full ${colorClass} bg-current animate-bounce ${size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : size === 'xl' ? 'w-4 h-4' : 'w-2 h-2'}`} style={{ animationDelay: '0ms' }}></div>
            <div className={`rounded-full ${colorClass} bg-current animate-bounce ${size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : size === 'xl' ? 'w-4 h-4' : 'w-2 h-2'}`} style={{ animationDelay: '150ms' }}></div>
            <div className={`rounded-full ${colorClass} bg-current animate-bounce ${size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : size === 'xl' ? 'w-4 h-4' : 'w-2 h-2'}`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      case 'circle':
      default:
        return (
          <svg 
            className={`animate-spin ${sizeClass} ${colorClass}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
    }
  };

  // Determine if we need to display the spinner as an overlay
  if (overlay) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg">
          {renderSpinner()}
          {text && <div className={`mt-3 font-medium ${colorClass}`}>{text}</div>}
        </div>
      </div>
    );
  }

  // Otherwise render the spinner inline
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderSpinner()}
      {text && <div className={`ml-3 font-medium ${colorClass}`}>{text}</div>}
    </div>
  );
};

export default LoadingSpinner;
