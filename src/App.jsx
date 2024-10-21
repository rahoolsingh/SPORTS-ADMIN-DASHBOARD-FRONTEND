import { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import AtheleteAllRecords from "./components/Athelete/AtheleteAllRecords";
import Header from "./components/Header/Header";
import AtheletePendingRecords from "./components/Athelete/PendingAtheleteRecords";
import CoachAllRecords from "./components/Coach/CoachAllRecords";
import CoachPendingRecords from "./components/Coach/PendingCoachRecords";

const Auth = () => {
    // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // not-login -> login
    const [stage, setStage] = useState("not-login");
    const [page, setPage] = useState("pending-atheletes");
    const [loading, setLoading] = useState(false);
    const [sessionExpiry, setSessionExpiry] = useState("");

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
        fetch(import.meta.env.VITE_BACKEND_URL)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });
    }, []);

    return (
        <>
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
