export function Button({ children, onClick, variant = "default", className = "", disabled = false, ...props }) {
    const baseClasses =
        "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"

    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    }

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : ""

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${disabledClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}