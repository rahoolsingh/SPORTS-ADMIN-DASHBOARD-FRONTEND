import { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import AtheleteAllRecords from "./components/Athelete/AtheleteAllRecords";
import Header from "./components/Header/Header";
import AtheletePendingRecords from "./components/Athelete/PendingAtheleteRecords";
import CoachAllRecords from "./components/Coach/CoachAllRecords";
import CoachPendingRecords from "./components/Coach/PendingCoachRecords";
import axios from "axios";

const loadingEmoji = ["🚀", "🛸", "🛰️", "🌌", "🌠", "🌟", "💫", "✨"];

const Auth = () => {
    // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // not-login -> login
    const [stage, setStage] = useState("not-login");
    const [page, setPage] = useState("pending-atheletes");
    const [loading, setLoading] = useState(false);
    const [sessionExpiry, setSessionExpiry] = useState("");
    const [serverStatus, setServerStatus] = useState("");
    const [loadingEmojiIndex, setLoadingEmojiIndex] = useState(0);

    const [sessionDuration, setSessionDuration] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (sessionExpiry) {
                const expiryTime = new Date(sessionExpiry).getTime();
                const currentTime = new Date().getTime();
                const difference = expiryTime - currentTime;

                const hours = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setSessionDuration({
                    hours,
                    minutes,
                    seconds,
                });

                if (difference < 0) {
                    clearInterval(interval);
                    setStage("not-login");
                    setSessionExpiry("");
                    setSessionDuration({
                        hours: 0,
                        minutes: 0,
                        seconds: 0,
                    });
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [sessionExpiry]);

    useEffect(() => {
        // call backend to wake up the server
        setServerStatus("checking");
        const url = import.meta.env.VITE_BACKEND_URL;
        console.log("Backend URL:", url);
        axios
            .get(url)
            .then((res) => {
                console.log(res.data);
                if (res.data.success) {
                    setServerStatus("online");
                }
            })
            .catch((err) => {
                console.error("Error checking server status:", err);
                setServerStatus("offline");
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingEmojiIndex((prev) => {
                return prev === loadingEmoji.length - 1 ? 0 : prev + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    });

    return (
        <>
            {serverStatus === "offline" && (
                <div className="h-screen flex flex-col items-center justify-center absolute top-0 left-0 w-full bg-gray-50/80 z-50">
                    {/* close the overlay  */}
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => {
                                setServerStatus("");
                            }}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
                        >
                            <span>Close</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-3xl">
                        {/* sad face */}
                        😞
                    </div>
                    <div className="text-center text-red-700 mt-4 text-xl">
                        Oops! Server is offline
                    </div>
                    <p>
                        We are sorry, but the server is currently offline.
                        Please try again later.
                    </p>
                    {/* contact the developer on whatsapp */}
                    <p className="mt-4">
                        Contact the developer on Instagram:{" "}
                        <a
                            href="https://www.instagram.com/i.veerrajpoot/"
                            className="text-blue-500"
                        >
                            i.veerrajpoot
                        </a>
                    </p>
                    <div className="flex gap-5 mt-4">
                        <a
                            href="https://github.com/rahoolsingh"
                            target="_blank"
                        >
                            <i className="fab fa-github text-2xl text-gray-500 hover:text-black"></i>
                        </a>
                        <a
                            href="https://www.instagram.com/i.veerrajpoot/"
                            target="_blank"
                        >
                            <i className="fab fa-instagram text-2xl text-gray-500 hover:text-black"></i>
                        </a>
                        <a
                            href="https://www.x.com/i_veerrajpoot"
                            target="_blank"
                        >
                            <i className="fab fa-x-twitter text-2xl text-gray-500 hover:text-black"></i>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/rahoolsingh/"
                            target="_blank"
                        >
                            <i className="fab fa-linkedin text-2xl text-gray-500 hover:text-black"></i>
                        </a>
                    </div>
                </div>
            )}

            {serverStatus === "checking" && (
                <div className="h-screen flex flex-col items-center justify-center absolute top-0 left-0 w-full bg-gray-50/80 z-50 p-5 text-center">
                    {/* close the overlay  */}
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => {
                                setServerStatus("");
                            }}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
                        >
                            <span>Close</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-3xl">
                        {loadingEmoji[loadingEmojiIndex]}
                    </div>
                    <div className="text-center text-blue-700 mt-4 text-xl">
                        Waking up the server
                    </div>
                    <p>
                        This is a hobby project and the server spins down after
                        a while. Please wait for a few seconds for the server to
                        wake up.
                    </p>
                    <p>
                        If it is taking too long, please{" "}
                        <button
                            onClick={() => {
                                window.location.reload();
                            }}
                            className="text-blue-500 hover:underline"
                        >
                            refresh
                        </button>{" "}
                        the page.
                    </p>

                    <div className="flex gap-5 mt-4">
                        <a
                            href="https://github.com/rahoolsingh"
                            target="_blank"
                        >
                            <i className="fab fa-github text-2xl text-gray-500 hover:text-black"></i>
                        </a>
                        <a
                            href="https://www.instagram.com/i.veerrajpoot/"
                            target="_blank"
                        >
                            <i className="fab fa-instagram text-2xl text-gray-500 hover:text-black"></i>
                        </a>
                        <a
                            href="https://www.x.com/i_veerrajpoot"
                            target="_blank"
                        >
                            <i className="fab fa-x-twitter text-2xl text-gray-500 hover:text-black"></i>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/rahoolsingh/"
                            target="_blank"
                        >
                            <i className="fab fa-linkedin text-2xl text-gray-500 hover:text-black"></i>
                        </a>
                    </div>
                </div>
            )}

            {loading && (
                <div className="h-screen flex flex-col items-center justify-center absolute top-0 left-0 w-full bg-gray-800 z-50">
                    <div className="flex items-center justify-center gap-2">
                        <div
                            className="animate-spin inline-block w-8 h-8 rounded-full border-4 border-b-blue-500"
                            role="status"
                        ></div>
                        {/* Veer Rajpoot Text fluid animation */}
                        <div className="text-3xl font-bold text-blue-500">
                            Veer Rajpoot
                        </div>

                        <div className="text-3xl font-bold text-blue-500">
                            Technology
                        </div>
                    </div>

                    <div className="text-center text-gray-100 mt-4">
                        Loading...
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center justify-between h-full min-h-screen">
                <Header
                    stage={stage}
                    setStage={setStage}
                    page={page}
                    setPage={setPage}
                    sessionDuration={sessionDuration}
                />
                {stage === "not-login" && (
                    <Login
                        setStage={setStage}
                        setSessionExpiry={setSessionExpiry}
                        setLoading={setLoading}
                    />
                )}

                {stage === "login" && page === "all-atheletes" && (
                    <AtheleteAllRecords setLoading={setLoading} />
                )}

                {stage === "login" && page === "pending-atheletes" && (
                    <AtheletePendingRecords setLoading={setLoading} />
                )}

                {stage === "login" && page === "all-coaches" && (
                    <CoachAllRecords setLoading={setLoading} />
                )}

                {stage === "login" && page === "pending-coaches" && (
                    <CoachPendingRecords setLoading={setLoading} />
                )}

                <footer className="p-4 dark:text-gray-50 w-full mt-4">
                    <div className="ml-auto w-full">
                        <p className="text-right text-sm mt-2">
                            Made with ❤️ by Veer Rajpoot
                            <span className="text-xs ml-2 text-gray-400">
                                {new Date().getFullYear()}
                            </span>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Auth;
