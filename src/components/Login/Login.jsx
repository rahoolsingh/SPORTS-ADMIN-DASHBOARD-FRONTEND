import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import propTypes from "prop-types";
import ManageLoginMail from "./ManageLoginMail";

const Login = ({ setStage, setSessionExpiry }) => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
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
                    setOtpSent(true);
                    setStage("login");
                    setSessionExpiry(response.data.sessionExpiry);
                })
                .catch((error) => {
                    Cookies.remove("jwt");
                    console.error("Error continuing session:", error.message);
                });
        }
    }, [BACKEND_URL, setStage, setSessionExpiry]);

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
                const token = response.data.token; // Assuming your backend returns the token
                Cookies.set("jwt", token, { secure: true, sameSite: "Strict" });
                setStage("login");
                setSessionExpiry(response.data.sessionExpiry);
            }
        } catch (error) {
            setErrorMessage("Invalid OTP! Please try again.");
            console.error("Error verifying OTP:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 p-5">
            <div className="bg-white dark:bg-boxdark md:shadow-lg rounded-lg overflow-hidden w-full max-w-8xl">
                <div className="flex flex-wrap items-center">
                    <div className="w-full xl:w-1/2 border-b-2 xl:border-b-0 xl:border-r-2 border-stroke dark:border-strokedark">
                        <div className="p-8 sm:p-12 xl:p-16">
                            <h2 className="text-2xl font-bold text-black dark:text-white text-center mb-8">
                                LOGIN TO ADMIN DASHBOARD
                            </h2>

                            <p className="md:hidden text-xs mb-9 text-red-600 text-justify">
                                This is a test version of the admin dashboard.
                                It is not optimized for mobile view. We
                                recommend using a bigger screen for better user
                                experience.
                            </p>

                            <form className="space-y-6 w-full">
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary disabled:opacity-50 disabled:bg-gray-200"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                            disabled={otpSent}
                                        />
                                    </div>
                                </div>

                                {otpSent && (
                                    <div className="mb-6">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            OTP
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Enter OTP"
                                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                value={otp}
                                                onChange={(e) =>
                                                    setOtp(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mb-5">
                                    <button
                                        type="button"
                                        onClick={
                                            otpSent
                                                ? handleVerifyOtp
                                                : handleSendOtp
                                        }
                                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 transition hover:bg-opacity-90"
                                        disabled={loading}
                                    >
                                        {otpSent
                                            ? loading
                                                ? "Verifying..."
                                                : "Verify OTP"
                                            : loading
                                            ? "Sending OTP..."
                                            : "Send OTP"}
                                    </button>
                                </div>

                                {errorMessage && (
                                    <p className="text-center text-red-600">
                                        {errorMessage}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="w-full xl:w-1/2 p-12 flex items-center justify-center bg-slate-50 dark:bg-gray-900">
                        <div className="text-center space-y-8">
                            <img
                                className="dark:invert mx-auto h-32"
                                src="https://res.cloudinary.com/dwiouayh7/image/upload/v1728839717/My%20Brand/veerRajpoot_mplaff.png"
                                alt="Brand Logo"
                            />
                            <p className="text-lg font-semibold text-red-600">
                                TEST VERSION
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                You can access dummy data using your email and
                                OTP for this test version. In production, only
                                authorized users will have access.
                            </p>
                            <ManageLoginMail BACKEND_URL={BACKEND_URL} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

Login.propTypes = {
    setStage: propTypes.func.isRequired,
    setSessionExpiry: propTypes.func.isRequired,
};
