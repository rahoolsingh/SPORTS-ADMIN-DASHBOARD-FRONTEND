import axios from "axios";
import propTypes from "prop-types";
import { useEffect, useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Import hamburger and close icons

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Header({ stage, setStage, page, setPage, sessionDuration }) {
    const [labelCount, setLabelCount] = useState({
        "all-atheletes": 0,
        "pending-atheletes": 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // For mobile menu toggle

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
        <header className="bg-white w-full">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex-1 md:flex md:items-center md:gap-12">
                        <a className="block text-teal-600" href="#">
                            <span className="sr-only">Home</span>
                            <img src="/logo.png" alt="Logo" className="h-8" />
                        </a>
                    </div>

                    {stage === "login" && (
                        <div className="md:flex md:items-center md:gap-12">
                            {/* Page Navigation */}
                            <nav
                                aria-label="Global"
                                className="hidden md:block"
                            >
                                <ul className="flex items-center gap-6 text-sm">
                                    {pages.map((navPage) => (
                                        <li key={navPage.value}>
                                            <button
                                                className={`${
                                                    page === navPage.value
                                                        ? "text-teal-600"
                                                        : "text-gray-600"
                                                }`}
                                                onClick={() =>
                                                    setPage(navPage.value)
                                                }
                                            >
                                                {navPage.label} (
                                                {labelCount[navPage.value]})
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Profile Menu */}

                            <div className="relative flex ">
                                <button
                                    onClick={logout}
                                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                    role="menuitem"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                                        />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Session Duration Display */}
                    {sessionDuration && stage === "login" && (
                        <div className="hidden md:block text-gray-600">
                            Session Time: {formatTimestamp(sessionDuration)}
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && stage === "login" && (
                <div className="md:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {pages.map((navPage) => (
                            <button
                                key={navPage.value}
                                onClick={() => {
                                    setPage(navPage.value);
                                    setMobileMenuOpen(false); // Close menu after selecting
                                }}
                                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                                    page === navPage.value
                                        ? "text-teal-600"
                                        : "text-gray-700"
                                } hover:bg-gray-100`}
                            >
                                {navPage.label} ({labelCount[navPage.value]})
                            </button>
                        ))}
                        <button
                            onClick={logout}
                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-gray-100"
                        >
                            Logout
                        </button>

                        {sessionDuration && (
                            <div className="px-3 py-2 text-sm text-gray-600">
                                Session Time: {formatTimestamp(sessionDuration)}
                            </div>
                        )}
                    </div>
                </div>
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
    sessionDuration: propTypes.object,
};
