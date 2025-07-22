export function Avatar({ src, alt, fallback, size = "md", className = "" }) {
    const sizes = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
        xl: "h-12 w-12",
    }

    return (
        <div
            className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
        >
            {src ? (
                <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" />
            ) : (
                <span className="text-xs font-medium text-gray-600">{fallback}</span>
            )}
        </div>
    )
}

