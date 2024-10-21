import { useEffect, useState } from "react";
import axios from "axios";

function ManageLoginMail({ BACKEND_URL }) {
    const [email, setEmail] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");

    const handleAddUser = () => {
        const url = `${BACKEND_URL}/auth/test/add-user/${email}`;
        // make get request to the url
        axios
            .get(url)
            .then((res) => {
                console.log(res.data);
                if (res.data.success) {
                    setStatusMessage(res.data.message);
                    setStatusType("success");
                } else {
                    setStatusMessage(res.data.message);
                    setStatusType("error");
                }
            })
            .catch((err) => {
                setStatusMessage(
                    err.response.data.message ||
                        "Something went wrong while adding user."
                );
                setStatusType("error");
            });
    };

    const handleDeleteUser = () => {
        const url = `${BACKEND_URL}/auth/test/delete-user/${email}`;
        // make get request to the url
        axios
            .get(url)
            .then((res) => {
                console.log(res.data);
                if (res.data.success) {
                    setStatusMessage(res.data.message);
                    setStatusType("success");
                } else {
                    setStatusMessage(res.data.message);
                    setStatusType("error");
                }
            })
            .catch((err) => {
                setStatusMessage(
                    err.response.data.message ||
                        "Something went wrong while deleting user."
                );
                setStatusType("error");
            });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatusMessage("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [statusMessage]);

    return (
        <div className="container mx-auto p-4">
            {statusMessage && ( // Show status card if there is a message
                <div
                    className={`status-card p-2 rounded text-white ${
                        statusType === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    {statusMessage}
                </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="mt-5">
                <p className="text-center text-gray-700 mt-2">
                    Add or delete mail from the login list for testing purposes.
                </p>
                <table className="table-auto w-full hidden md:block">
                    <tbody>
                        <tr className="border-t">
                            <td className="px-4 py-3 text-gray-700">
                                Add / Delete Mail
                            </td>
                            <td className="px-4 py-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter email"
                                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </td>
                            <td className="px-4 py-3 text-center flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleAddUser}
                                    className="text-green-500 px-1 py-2 rounded hover:text-green-600 transition duration-300 ease-in-out mr-2"
                                    title="Add User"
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteUser}
                                    className="text-red-500 px-1 py-2 rounded hover:text-red-600 transition duration-300 ease-in-out"
                                    title="Delete User"
                                >
                                    <i className="far fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* mobile view */}
                <div className="block md:hidden">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter email"
                        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="flex justify-center mt-2">
                        <button
                            type="button"
                            onClick={handleAddUser}
                            className="text-green-500 px-1 py-2 rounded hover:text-green-600 transition duration-300 ease-in-out mr-2"
                            title="Add User"
                        >
                            <span className="">Add User</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteUser}
                            className="text-red-500 px-1 py-2 rounded hover:text-red-600 transition duration-300 ease-in-out"
                            title="Delete User"
                        >
                            <span className="">Delete User</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ManageLoginMail;
