import axios from "axios";
import propTypes from "prop-types";
import { useEffect, useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Header({ stage, setStage, page, setPage, sessionDuration }) {
    const [labelCount, setLabelCount] = useState({
        "all-atheletes": 0,
        "pending-atheletes": 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatTimestamp = (duration) => {
        const { hours, minutes, seconds } = duration;
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const pages = useMemo(
        () => [
            {
                label: "All Athletes Records",
                value: "all-atheletes",
                api: "/all-atheletes",
                countApi: "athelete/all-count",
            },
            {
                label: "Pending Athletes",
                value: "pending-atheletes",
                api: "/pending-athletes",
                countApi: "athelete/pending-count",
            },

            {
                label: "All Coaches Records",
                value: "all-coaches",
                api: "/all-coaches",
                countApi: "coach/all-count",
            },
            {
                label: "Pending Coaches",
                value: "pending-coaches",
                api: "/pending-coaches",
                countApi: "coach/pending-count",
            },
        ],
        []
    );

    const logout = () => {
        Cookies.remove("jwt");
        setStage("not-login");
    };

    const getCount = useCallback(async (api) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/${api}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });
            return response.data.count;
        } catch (error) {
            console.error("Error fetching count:", error.message);
            setError("Failed to fetch data.");
            return 0;
        }
    }, []);

    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            try {
                const counts = await Promise.all(
                    pages.map((page) => getCount(page.countApi))
                );
                const newLabelCount = {};
                counts.forEach((count, index) => {
                    newLabelCount[pages[index].value] = count;
                });
                setLabelCount(newLabelCount);
            } catch {
                setError("Error fetching athlete counts.");
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, [getCount, pages, stage]);

    return (
        <header className="p-4 bg-gray-900 text-gray-50 w-full shadow-md">
            <div className="container flex justify-between items-center mx-auto">
                {stage === "not-login" && (
                    <div className="mt-2">
                        <h1 className="text-3xl font-bold">Admin Panel</h1>
                    </div>
                )}
                <ul className="space-x-4 hidden lg:flex">
                    {stage === "login" && loading && (
                        <li className="flex">
                            <span className="text-gray-300">Loading...</span>
                        </li>
                    )}
                    {stage === "login" &&
                        !loading &&
                        pages.map((label) => (
                            <li className="flex" key={label.value}>
                                <button
                                    onClick={() => setPage(label.value)}
                                    className={`${
                                        label.value === page
                                            ? "bg-gray-700"
                                            : "bg-gray-800"
                                    } px-4 py-2 text-white rounded hover:bg-gray-700/30 transition duration-300`}
                                    aria-label={`View ${label.label}`}
                                >
                                    {label.label}
                                </button>
                            </li>
                        ))}
                </ul>
                {sessionDuration && stage === "login" && (
                    <div className="flex items-center gap-4">
                        <span className="hidden lg:block">
                            Session Duration:
                        </span>
                        <span
                            className={`${
                                sessionDuration.seconds === 0 &&
                                sessionDuration.hours === 0 &&
                                sessionDuration.minutes === 0
                                    ? "hidden"
                                    : sessionDuration.minutes < 5
                                    ? "text-red-500 font-bold animate-bounce"
                                    : ""
                            }`}
                        >
                            {formatTimestamp(sessionDuration)}
                        </span>

                        <span className="hidden lg:block">
                            {stage === "login" ? "" : "Not Logged In"}
                        </span>
                        {stage === "login" && (
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                                aria-label="Logout"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                )}
            </div>
            {stage === "login" && (
                <p className="text-center text-sm text-gray-300 mt-2">
                    You are currently in test mode. Update the email in any
                    record below to test the ID card generation.
                </p>
            )}
        </header>
    );
}

export default Header;

Header.propTypes = {
    stage: propTypes.string.isRequired,
    setStage: propTypes.func.isRequired,
    page: propTypes.string.isRequired,
    setPage: propTypes.func.isRequired,
    sessionDuration: propTypes.string,
};
