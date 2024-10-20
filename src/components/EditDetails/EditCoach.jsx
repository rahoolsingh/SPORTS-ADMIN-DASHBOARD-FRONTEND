import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function EditCoach() {
    // url structure = /edit-coach/:regNo
    const { regNo } = useParams();
    const [coachData, setCoachData] = useState(null);
    const [oldData, setOldData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/coach/details/${regNo}`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                }
            );
            setCoachData(response.data);
            setOldData(response.data);

            setLoading(false);
            console.log("Coach data:", response.data);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setError(error);
        }
    };

    // Update state on input change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setCoachData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // send data to the server
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (coachData === null || oldData === null || coachData === oldData) {
            setError({
                message:
                    "No changes detected. Please edit some fields to submit.",
            });
            return;
        }
        try {
            setSubmitting(true);
            const response = await axios.put(
                `${BACKEND_URL}/coach/update/${regNo}`,
                coachData,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                }
            );
            console.log("Response:", response.data);
            setSubmitting(false);
            setResponse(response);
        } catch (error) {
            console.error(error);
            setSubmitting(false);
            setError(error);
        }
    };

    // Format date fields
    const dateFieldFormat = (date) => {
        // Convert date fields to YYYY-MM-DD format
        return new Date(date).toISOString().split("T")[0];
    };

    useEffect(() => {
        fetchData();
    }, [regNo]);

    if (loading) {
        return (
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

                <div className="text-center text-gray-100 mt-4">Loading...</div>
            </div>
        );
    }

    if (response?.data?.status === 200) {
        return (
            <div className="text-white h-screen flex flex-col justify-center items-center">
                <p className="text-center text-2xl font-bold">
                    {response?.data?.message}
                </p>
                <h3 className="text-center">
                    <button
                        onClick={() => {
                            window.close();
                        }}
                        className="text-blue-500 underline"
                    >
                        click here to close this tab
                    </button>
                </h3>
                <div className="mt-4">
                    <p className="text-center">Powered by Veer Rajpoot</p>
                    <img
                        className="h-14 mx-auto invert"
                        src="https://res.cloudinary.com/dwiouayh7/image/upload/v1728839717/My%20Brand/veerRajpoot_mplaff.png"
                        alt="Data Updated Successfully"
                    />
                </div>
            </div>
        );
    }

    if (response?.data?.status === 500) {
        return (
            <div className="text-white h-screen flex flex-col justify-center items-center">
                <p className="text-center text-2xl font-bold">
                    {response?.data?.message}
                </p>
                <h3 className="text-center">Please Try Again Later</h3>
                <p>
                    Make sure you are connected to the internet and your session
                    is not expired on the dashboard
                </p>
                <div className="mt-4">
                    <p className="text-center">Powered by Veer Rajpoot</p>
                    <img
                        className="h-14 mx-auto invert"
                        src="https://res.cloudinary.com/dwiouayh7/image/upload/v1728839717/My%20Brand/veerRajpoot_mplaff.png"
                        alt="Data Updated Successfully"
                    />
                </div>
            </div>
        );
    }

    if (!coachData) {
        return (
            <div className="text-white h-screen flex flex-col justify-center items-center">
                <p className="text-center text-2xl font-bold">No data found</p>
                <h3 className="text-center">
                    Please Make Sure You Are Logged In And Session Is Not
                    Expired
                </h3>
                <div className="mt-4">
                    <p className="text-center">Powered by Veer Rajpoot</p>
                    <img
                        className="h-14 mx-auto invert"
                        src="https://res.cloudinary.com/dwiouayh7/image/upload/v1728839717/My%20Brand/veerRajpoot_mplaff.png"
                        alt="No data found"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto bg-gray-900 text-white p-6 rounded-lg">
            {/* no scrollable, error on bottom left */}
            {error && (
                <div className="bg-red-500 p-2 text-white text-sm fixed bottom-10 right-10">
                    {error.message}
                </div>
            )}

            <h1 className="text-2xl font-bold text-center my-4">Edit Coach</h1>

            <form onSubmit={handleSubmit}>
                <p className="text-center text-white">
                    Text fields are editable. Dropdowns are not yet implemented.
                </p>
                <div className="flex justify-center items-center my-4">
                    Editing Coach:
                    <span className="font-bold ml-2">{coachData.regNo}</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {formFields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-white"
                            >
                                {field.label}
                            </label>

                            {field.type === "text" && (
                                <input
                                    type="text"
                                    name={field.name}
                                    id={field.name}
                                    value={coachData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-md"
                                />
                            )}

                            {field.type === "dropdown" && (
                                <select
                                    name={field.name}
                                    id={field.name}
                                    value={coachData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-md"
                                >
                                    {field.options.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {field.type === "tel" && (
                                <input
                                    type="tel"
                                    name={field.name}
                                    id={field.name}
                                    value={coachData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-md"
                                />
                            )}

                            {field.type === "email" && (
                                <input
                                    type="email"
                                    name={field.name}
                                    id={field.name}
                                    value={coachData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-md"
                                />
                            )}

                            {oldData[field.name] !== coachData[field.name] && (
                                <div className="text-red-500 text-sm">
                                    <span>
                                        Caution: You have changed this field.
                                    </span>
                                    <button
                                        onClick={() => {
                                            setCoachData((prevData) => ({
                                                ...prevData,
                                                [field.name]:
                                                    oldData[field.name],
                                            }));
                                        }}
                                        className="text-red-500 underline ml-1"
                                    >
                                        Undo
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {dateFields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-white"
                            >
                                {field.label}
                            </label>

                            <input
                                type="date"
                                name={field.name}
                                id={field.name}
                                value={dateFieldFormat(coachData[field.name])}
                                onChange={handleChange}
                                required={field.required}
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-700 text-black rounded-md"
                            />
                            {oldData.dob !== coachData.dob && (
                                <div className="text-red-500 text-sm">
                                    <span>
                                        Caution: You have changed this field.
                                    </span>
                                    <button
                                        onClick={() => {
                                            setCoachData((prevData) => ({
                                                ...prevData,
                                                dob: oldData.dob,
                                            }));
                                        }}
                                        className="text-red-500 underline ml-1"
                                    >
                                        Undo
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <hr className="my-8 border border-gray-700" />
                <p className="text-center text-white">
                    These fields are uneditable.
                </p>
                <div className="grid grid-cols-3 gap-6">
                    {uneditableFields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-white"
                            >
                                {field.label}
                            </label>

                            <span
                                type="text"
                                name={field.name}
                                id={field.name}
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-md"
                            >
                                {String(coachData[field.name])}
                            </span>
                        </div>
                    ))}
                </div>
                <p className="text-center text-white">Documents (View Only)</p>

                <div className="grid grid-cols-5 gap-6">
                    {documentFields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label
                                className="block text-sm font-medium text-white"
                                htmlFor={field.name}
                            >
                                {field.label}
                            </label>
                            <a
                                href={coachData[field.name]}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={coachData[field.name]}
                                    alt={field.label}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                                View in new tab
                            </a>
                        </div>
                    ))}
                </div>
                {/* show a table with old data and new data for changed fields
                only  */}
                {oldData !== coachData && (
                    <div className="my-8 max-w-3xl text-left">
                        <h2 className="text-xl font-bold text-center mb-4">
                            Changes Summary
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-gray-800 text-white rounded-lg">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="py-2 px-4 border-b border-gray-600">
                                            Field Name
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-600">
                                            Old Value
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-600">
                                            New Value
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(coachData).map((key) => {
                                        if (oldData[key] !== coachData[key]) {
                                            return (
                                                <tr
                                                    key={key}
                                                    className="hover:bg-gray-700"
                                                >
                                                    <td className="py-2 px-4 border-b border-gray-600">
                                                        {key}
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-600">
                                                        {oldData[key]}
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-600">
                                                        {coachData[key]}

                                                        {key === "status" &&
                                                            (coachData[key] ===
                                                                "approved" ||
                                                                coachData[
                                                                    key
                                                                ] ===
                                                                    "rejected") && (
                                                                <p className="text-red-500">
                                                                    Warning:
                                                                    Email will
                                                                    not be sent
                                                                    to the
                                                                    coach. To
                                                                    send email,
                                                                    approve or
                                                                    reject the
                                                                    coach from
                                                                    the
                                                                    dashboard.
                                                                </p>
                                                            )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="my-4">
                    <input
                        type="checkbox"
                        id="confirm"
                        required
                        className="mr-2"
                    />
                    <label htmlFor="confirm">
                        I confirm that the data entered is correct and I have
                        verified the same.
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className={`${
                        submitting ? "bg-gray-500" : "bg-blue-500"
                    } text-white p-2 rounded-md mt-4 w-fit px-5 ml-auto

                        `}
                >
                    {submitting ? "Submitting..." : "Submit Changes"}
                </button>
            </form>
        </div>
    );
}

export default EditCoach;

// Field configurations for Coach data
const formFields = [
    {
        label: "Coach Name",
        name: "playerName",
        type: "text",
        required: true,
    },
    {
        label: "Father Name",
        name: "fatherName",
        type: "text",
        required: true,
    },
    {
        label: "Mother Name",
        name: "motherName",
        type: "text",
        required: true,
    },
    {
        label: "Gender",
        name: "gender",
        type: "dropdown",
        options: [
            { value: "", label: "Select Gender" },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
        ],
        required: true,
    },
    {
        label: "District",
        name: "district",
        type: "text",
        required: true,
    },
    {
        label: "Mobile Number",
        name: "mob",
        type: "tel",
        required: true,
    },
    {
        label: "Email Address",
        name: "email",
        type: "email",
        required: true,
    },
    {
        label: "Address",
        name: "address",
        type: "text",
        required: true,
    },
    {
        label: "PIN Code",
        name: "pin",
        type: "text",
        required: true,
    },
    {
        label: "Aadhar Number",
        name: "adharNumber",
        type: "text",
        required: true,
    },
    {
        label: "PAN Number",
        name: "panNumber",
        type: "text",
        required: false,
    },
    {
        label: "Status",
        name: "status",
        type: "dropdown",
        options: [
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
        ],
    },
];

const dateFields = [
    {
        label: "Date of Birth",
        name: "dob",
        type: "date",
        required: true,
    },
];

const uneditableFields = [
    {
        label: "Payment Status",
        name: "payment",
    },
    {
        label: "Created At",
        name: "createdAt",
    },
    {
        label: "Updated At",
        name: "updatedAt",
    },
    {
        label: "Status",
        name: "status",
    },
];

const documentFields = [
    {
        label: "Photo",
        name: "photo",
        type: "image",
        required: true,
    },
    {
        label: "Black Belt Certificate",
        name: "blackBeltCertificate",
        type: "image",
        required: true,
    },
    {
        label: "Resident Certificate",
        name: "residentCertificate",
        type: "image",
        required: true,
    },
    {
        label: "Aadhar Front Photo",
        name: "adharFrontPhoto",
        type: "image",
        required: true,
    },
    {
        label: "Aadhar Back Photo",
        name: "adharBackPhoto",
        type: "image",
        required: true,
    },
];
