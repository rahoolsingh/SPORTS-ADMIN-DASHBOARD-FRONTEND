import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Importing js-cookie to manage cookies
import propTypes from "prop-types";

function Login({ setStage }) {
    const [email, setEmail] = useState("rahulksingh3907@gmail.com");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios
                .post(`${BACKEND_URL}/auth/continue-session`)
                .then((response) => {
                    setIsVerified(true);
                    setOtpSent(true);
                    setStage("login");
                })
                .catch((error) => {
                    Cookies.remove("jwt");
                });
        }
    }, []);

    const handleSendOtp = async () => {
        setLoading(true);
        setErrorMessage(""); // Reset error message
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/send-otp`, {
                email,
            });
            if (response.status === 200) {
                setOtpSent(true);
            }
        } catch (error) {
            setErrorMessage(
                error.response
                    ? error.response.data.message
                    : "Error sending OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        setErrorMessage(""); // Reset error message
        try {
            const response = await axios.post(
                `${BACKEND_URL}/auth/verify-otp`,
                { email, otp }
            );
            if (response.status === 200) {
                setIsVerified(true);
                const token = response.data.token; // Assuming your backend returns the token
                Cookies.set("jwt", token, { secure: true, sameSite: "Strict" });
                setStage("login");
            }
        } catch (error) {
            setErrorMessage("Invalid OTP! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full">
            <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">
                    Admin Login
                </h2>
                {errorMessage && (
                    <p className="text-red-500 text-center mb-4">
                        {errorMessage}
                    </p>
                )}
                {!otpSent ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendOtp();
                        }}
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-4 mb-4 w-full border border-gray-300 rounded text-black dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 ${
                                loading ? "bg-gray-400" : "bg-blue-600"
                            } text-white rounded hover:bg-blue-700 transition-colors duration-300`}
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    !isVerified && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleVerifyOtp();
                            }}
                        >
                            <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
                                Enter OTP
                            </h2>
                            <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
                                OTP has been sent to {email}
                            </p>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="p-4 mb-4 w-full border border-gray-300 rounded text-black dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 ${
                                    loading ? "bg-gray-400" : "bg-green-600"
                                } text-white rounded hover:bg-green-700 transition-colors duration-300`}
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </form>
                    )
                )}
            </div>
        </div>
    );
}

export default Login;

Login.propTypes = {
    setStage: propTypes.func.isRequired,
};
