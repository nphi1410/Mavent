import React from 'react';

// Map of button variants to class names
const BUTTON_VARIANTS = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  ghost: "bg-transparent hover:bg-gray-100",
  link: "bg-transparent text-blue-600 underline-offset-4 hover:underline"
};

// Map of button sizes to class names
const BUTTON_SIZES = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3 text-sm",
  lg: "h-11 rounded-md px-8 text-lg",
  icon: "h-10 w-10"
};

/**
 * Button component using only React and Tailwind CSS
 */
const Button = ({
  children,
  className = "",
  disabled = false,
  variant = "default",
  size = "default",
  type = "button",
  onClick,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variantClasses = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.default;
  const sizeClasses = BUTTON_SIZES[size] || BUTTON_SIZES.default;
  
  const classes = [baseClasses, variantClasses, sizeClasses, className].filter(Boolean).join(" ");
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button, BUTTON_VARIANTS as buttonVariants };
export default Button;
