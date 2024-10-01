import axios from "axios";
import propTypes from "prop-types";
import { useEffect, useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Header({ stage, setStage, page, setPage }) {
    const [labelCount, setLabelCount] = useState({
        "all-atheletes": 0,
        "pending-atheletes": 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <header className="p-4 bg-gray-800 text-gray-50 w-full">
            <div className="container flex justify-between mx-auto">
                {stage === "not-login" && (
                    <div className="mt-2">
                        <h1 className="text-2xl font-bold">Admin Panel</h1>
                        <p className="text-sm">J&K Taekwondo Association</p>
                    </div>
                )}
                <ul className="space-x-2 hidden lg:flex">
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
                                    {labelCount[label.value] > 0 && (
                                        <p className="text-xs text-left">
                                            Records: {labelCount[label.value]}
                                        </p>
                                    )}
                                </button>
                            </li>
                        ))}
                </ul>
                <div className="items-center flex-shrink-0 hidden lg:flex gap-2">
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
            </div>
            {/* {error && <p className="text-red-500 text-center mt-2">{error}</p>} */}
        </header>
    );
}

export default Header;

Header.propTypes = {
    stage: propTypes.string.isRequired,
    setStage: propTypes.func.isRequired,
    page: propTypes.string.isRequired,
    setPage: propTypes.func.isRequired,
};
