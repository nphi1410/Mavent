export function Input({ className = "", ...props }) {
    return (
        <input
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
            {...props}
        />
    )
}