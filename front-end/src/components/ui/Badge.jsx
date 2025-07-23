export function Badge({ children, variant = "default", className = "" }) {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        secondary: "bg-gray-100 text-gray-800",
        outline: "border border-gray-300 bg-white text-gray-700",
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    )
}
