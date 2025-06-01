import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/api/reset-password-request",
                {
                    email
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });

            if (response.status === 200) {
                setOtpSent(true);
                console.log("OTP sent successfully to:", email);
                // console.log(otpSent);
            }
        } catch (err) {
            setError(response?.data || "Failed to send OTP. Please try again.");
            console.error("Error sending OTP:", error);

            // setOtpSent("Failed to send OTP. Email may not be registered.");
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/verify-reset-otp",
                { email, otp },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            if (response.status === 200) {
                setOtpSent(true);
                console.log("OTP verified successfully. You can now reset your password.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000); // Redirect after 2 seconds
            }
        } catch (err) {
            setOtpSent("Failed to reset password. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-900">
            <div className="bg-white p-8 rounded-2xl w-5/12 text-center shadow-lg">
                <p className="text-left text-sm text-gray-600 mb-2 cursor-pointer hover:underline">
                    <NavLink to="/login" className="font-bold hover:underline hover:text-blue-900">
                        ← Back to Login
                    </NavLink>
                </p>
                <h1 className="text-4xl font-bold mb-4 text-blue-900">RESET PASSWORD</h1>
                <form className="mb-6" onSubmit={otpSent ? resetPassword : handleSendOtp}>

                    <p className="text-sm mb-2 font-semibold">Enter your registered email</p>
                    <input
                        type="email"
                        placeholder="Enter email..."
                        className="w-full px-4 py-2 mb-4 border border-blue-300 rounded-full focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {otpSent && (
                        <div className="mb-5 flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700 pl-2.5">Enter OTP</label>
                            <div className='flex w-full justify-between items-center mb-3'>
                                <input
                                    type="text"
                                    placeholder="Enter OTP sent to email"
                                    className="pl-4 p-2 border border-blue-400 rounded-full w-11/16"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    id='otp-input'
                                    required
                                />
                                <button
                                    type="button"
                                    className=" py-2 px-5 rounded-full bg-[#f1f900] text-blue-900 font-semibold hover:bg-[#dde428] transition self-end"
                                    onClick={handleSendOtp}
                                >
                                    Resend OTP
                                </button>

                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
                    >
                        {otpSent ? 'Reset password' : 'Send OTP'}
                    </button>
                </form>
                {otpSent && <p className="mt-4 text-sm text-red-500">{otpSent}</p>}
            </div>
        </div>
    );
}

export default ResetPassword;
