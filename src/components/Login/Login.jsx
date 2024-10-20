import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import propTypes from "prop-types";
import ManageLoginMail from "./ManageLoginMail";

const Login = ({ setStage, setSessionExpiry }) => {
    const [email, setEmail] = useState("rahulksingh3907@gmail.com");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    // const [isVerified, setIsVerified] = useState(false);
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
                    // setIsVerified(true);
                    setOtpSent(true);
                    setStage("login");
                    setSessionExpiry(response.data.sessionExpiry);
                })
                .catch((error) => {
                    Cookies.remove("jwt");
                    console.error("Error continuing session:", error.message);
                });
        }
    });

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
                // setIsVerified(true);
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
        <>
            <div className="bg-white dark:bg-boxdark">
                <div className="flex flex-wrap items-center">
                    <div className="hidden w-full xl:block xl:w-1/2">
                        <div className="py-17.5 px-26 text-center">
                            <img
                                className="dark:invert m-auto"
                                src="https://res.cloudinary.com/dwiouayh7/image/upload/v1728839717/My%20Brand/veerRajpoot_mplaff.png"
                                alt="Logo"
                            />
                            <p className="text-center text-red-600 font-bold">
                                INFORMATION
                            </p>

                            <p className="text-center text-black dark:text-white text-sm">
                                This is a test version so you can access dummy
                                data with your email and OTP. But in production
                                only authorized users can access the data.
                            </p>

                            <ManageLoginMail BACKEND_URL={BACKEND_URL} />
                        </div>
                    </div>

                    <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                            <h2 className="md:mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                                LOGIN TO ADMIN DASHBOARD
                            </h2>

                            <p className="md:hidden text-xs mb-9 text-red-600 text-justify">
                                You are on mobile view. Please open this page on
                                a desktop to see add your email in the
                                authorized list in order to receive OTP. You can
                                also use "Show desktop site" option in your
                                browser.
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
                                    <input
                                        type="submit"
                                        value={
                                            otpSent
                                                ? loading
                                                    ? "Verifying..."
                                                    : "Verify OTP"
                                                : loading
                                                ? "Sending OTP..."
                                                : "Send OTP"
                                        }
                                        onClick={
                                            otpSent
                                                ? handleVerifyOtp
                                                : handleSendOtp
                                        }
                                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 transition hover:bg-opacity-90"
                                        disabled={loading}
                                    />
                                </div>

                                {errorMessage && (
                                    <p className="text-center text-red-600">
                                        {errorMessage}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;

Login.propTypes = {
    setStage: propTypes.func.isRequired,
    setSessionExpiry: propTypes.func.isRequired,
};
