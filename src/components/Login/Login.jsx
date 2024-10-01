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

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        // Check if JWT token exists in cookies
        const token = Cookies.get("jwt");
        if (token) {
            // Send token to the server to validate session
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            console.log(
                "JWT Token available, sending to server for validation..."
            );
            // You can call an endpoint here to validate the token if needed
            axios
                .post(`${BACKEND_URL}/auth/continue-session`)
                .then((response) => {
                    console.log(
                        "Session validated successfully!",
                        response.data
                    );
                    setIsVerified(true);
                    setLoading(false);
                    setOtpSent(true);
                    setStage("login");
                })
                .catch((error) => {
                    console.error(
                        "Error validating session:",
                        error.response
                            ? error.response.data.message
                            : error.message
                    );
                    Cookies.remove("jwt");
                });
        }
    });

    // Function to send OTP
    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/send-otp`, {
                email,
            });
            if (response.status === 200) {
                setOtpSent(true);
                alert("OTP sent successfully!");
            }
        } catch (error) {
            alert(
                `Error in sending OTP: ${
                    error.response ? error.response.data.message : error.message
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    // Function to verify OTP
    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/auth/verify-otp`,
                {
                    email,
                    otp,
                }
            );
            if (response.status === 200) {
                setIsVerified(true);
                // Store JWT token in secure cookie
                const token = response.data.token; // Assuming your backend returns the token
                Cookies.set("jwt", token, { secure: true, sameSite: "Strict" });
                setStage("login");
            }
        } catch (error) {
            alert("Invalid OTP!", error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    return !otpSent ? (
        <div className="flex flex-col items-center">
            <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 mb-4 w-72 border border-gray-300 rounded text-black"
            />
            <button
                onClick={handleSendOtp}
                disabled={loading}
                className={`px-4 py-2 ${
                    loading ? "bg-gray-400" : "bg-blue-500"
                } text-white rounded hover:bg-blue-600`}
            >
                {loading ? "Sending..." : "Send OTP"}
            </button>
        </div>
    ) : (
        !isVerified && (
            <div className="flex flex-col items-center">
                <h2 className="text-xl mb-4">Enter OTP sent to {email}</h2>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="p-2 mb-4 w-72 border border-gray-300 rounded text-black"
                />
                <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className={`px-4 py-2 ${
                        loading ? "bg-gray-400" : "bg-green-500"
                    } text-white rounded hover:bg-green-600`}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </div>
        )
    );
}

export default Login;

Login.propTypes = {
    setStage: propTypes.func.isRequired,
};
