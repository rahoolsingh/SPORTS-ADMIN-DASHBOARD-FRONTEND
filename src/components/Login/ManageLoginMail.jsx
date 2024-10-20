import { useState } from "react";

function ManageLoginMail({ BACKEND_URL }) {
    const [email, setEmail] = useState("");

    const handleAddUser = () => {
        const url = `${BACKEND_URL}/auth/test/add-user/${email}`;
        window.open(url, "_blank");
    };

    const handleDeleteUser = () => {
        const url = `${BACKEND_URL}/auth/test/delete-user/${email}`;
        window.open(url, "_blank");
    };

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={(e) => e.preventDefault()} className="mt-5">
                <p className="text-center text-gray-700 mt-2">
                    Add or delete mail from the login list for testing purposes.
                </p>
                <table className="table-auto w-full">
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
            </form>
        </div>
    );
}

export default ManageLoginMail;
