import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, Loader } from "lucide-react" // Lucide icons

const RedirectPage = ({
    message = "You must be logged in to view this page",
    pageName = "Login Page",
    redirectUrl = "/login",
}) => {
    const countDownSeconds = 5
    const [countdown, setCountdown] = useState(countDownSeconds)
    const navigate = useNavigate()

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(countdownInterval)
                    return 0
                }
                return prevCount - 1
            })
        }, 1000)

        const redirectTimeout = setTimeout(() => {
            navigate(redirectUrl)
        }, countDownSeconds * 1000)

        return () => {
            clearInterval(countdownInterval)
            clearTimeout(redirectTimeout)
        }
    }, [navigate, redirectUrl])

    const progressPercentage = ((countDownSeconds - countdown) / countDownSeconds) * 100

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-lg max-w-md w-full">
                <div className="bg-yellow-400 text-black px-6 py-4 rounded-t-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="text-lg font-semibold">Access Restricted</h4>
                </div>

                <div className="p-6 space-y-4 text-center">
                    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded relative">
                        <strong className="block text-sm">{message}</strong>
                    </div>

                    <div className="flex items-center justify-center text-sm text-gray-500 gap-2">
                        <Loader className="w-4 h-4 animate-spin text-blue-500" />
                        <span>Redirecting you to the</span>
                        <span className="font-medium text-blue-600">{pageName}</span>
                    </div>

                    <div>
                        <h2 className="text-4xl font-bold text-blue-600">{countdown}</h2>
                        <p className="text-sm text-gray-500">
                            {countdown === 1 ? "second" : "seconds"} remaining
                        </p>

                        <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                            <div
                                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-400">
                        You will be automatically redirected to <span className="font-semibold">{pageName}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RedirectPage
