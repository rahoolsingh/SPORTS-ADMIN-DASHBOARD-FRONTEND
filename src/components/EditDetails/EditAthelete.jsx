import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function EditAthelete() {
    // url structure = /edit-athlete/:regNo
    const { regNo } = useParams();
    const [athleteData, setAthleteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/athelete/details/${regNo}`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                }
            );
            setAthleteData(response.data);

            setLoading(false);
            console.log("Athlete data:", response.data);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // Update state on input change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setAthleteData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetchData();
    }, [regNo]);

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    if (!athleteData) {
        return (
            <div className="text-white h-screen flex flex-col justify-center items-center">
                <p className="text-center text-2xl font-bold">No data found</p>
                <h3 className="text-center">
                    Please Make Sure You Are Logged In And Session Is Not
                    Expired
                </h3>
                <div className="mt-4">
                    <p className="text-center">Powered by DRS Technology</p>
                    <img
                        className="h-14 mx-auto invert"
                        src="https://raw.githubusercontent.com/rahoolsingh/Backend/refs/heads/master/public/assets/logo-white-border.png"
                        alt="No data found"
                    />
                </div>
            </div>
        );
    }

    const dateFieldFormat = (date) => {
        // Convert date fields to YYYY-MM-DD format
        return new Date(date).toISOString().split("T")[0];
    };

    return (
        <div className="w-full mx-auto bg-gray-900 text-white p-6 rounded-lg">
            <h1 className="text-2xl font-bold text-center my-4">
                Edit Athlete
            </h1>

            <form action="">
                <p className="text-center text-gray-400">
                    Text fields are editable. Dropdowns are not yet implemented.
                </p>
                <div className="grid grid-cols-3 gap-6">
                    {formFields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-400"
                            >
                                {field.label}
                            </label>

                            {field.type === "text" && (
                                <input
                                    type="text"
                                    name={field.name}
                                    id={field.name}
                                    value={athleteData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-md"
                                />
                            )}

                            {field.type === "dropdown" && (
                                <select
                                    name={field.name}
                                    id={field.name}
                                    value={athleteData[field.name]}
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
                                    value={athleteData[field.name]}
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
                                    value={athleteData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-md"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {dateFields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-400"
                            >
                                {field.label}
                            </label>

                            <input
                                type="date"
                                name={field.name}
                                id={field.name}
                                value={dateFieldFormat(athleteData[field.name])}
                                onChange={handleChange}
                                required={field.required}
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-md"
                            />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {uneditableFields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-400"
                            >
                                {field.label}
                            </label>

                            <input
                                type="text"
                                name={field.name}
                                id={field.name}
                                value={athleteData[field.name]}
                                readOnly
                                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-md"
                            />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {documentFields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-400"
                            >
                                {field.label}
                            </label>

                            <a href={athleteData[field.name]} target="_blank">
                                <img
                                    src={athleteData[field.name]}
                                    alt={field.label}
                                />
                                View in new tab
                            </a>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}

export default EditAthelete;

const formFields = [
    {
        label: "Tracking Number",
        name: "regNo",
        type: "text",
        required: true,
    },
    {
        label: "Athlete Name",
        name: "athleteName",
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
        type: "dropdown",
        options: [
            { value: "", label: "Select Your District" },
            { value: "Jammu", label: "Jammu" },
            // Add other districts as necessary
        ],
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
        label: "Academy Name",
        name: "academyName",
        type: "text",
        required: true,
    },
    {
        label: "Coach Name",
        name: "coachName",
        type: "text",
        required: true,
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
        label: "Certificate",
        name: "certificate",
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

// {
//     "_id": "66f437757bbc92a9ba71c921",
//     "regNo": "ATH1727281006415",
//     "athleteName": "Pragati slathia",
//     "fatherName": "Dharminder singh slathia",
//     "motherName": "Bindu bala slathia",
//     "dob": "2010-03-29T00:00:00.000Z",
//     "gender": "female",
//     "district": "Jammu",
//     "mob": "9682524869",
//     "email": "iamindian.rks@gmail.com",
//     "adharNumber": "475193107521",
//     "address": "H.no 1/D/10 Vishal nagar talab tillo",
//     "pin": "180002",
//     "academyName": "United martilart academy",
//     "coachName": "Amit singh",
//     "photo": "https://res.cloudinary.com/dlq45ttnp/image/upload/v1727281008/uploads/byyatga4dmgszaqcjexv.png",
//     "certificate": "https://res.cloudinary.com/dlq45ttnp/image/upload/v1727281009/uploads/dm3ytk8va0rhgzct1mwz.jpg",
//     "residentCertificate": "https://res.cloudinary.com/dlq45ttnp/image/upload/v1727281010/uploads/o4tl6prmo1nw6uc7inqb.jpg",
//     "adharFrontPhoto": "https://res.cloudinary.com/dlq45ttnp/image/upload/v1727281011/uploads/mghq029fqarftlppepos.jpg",
//     "adharBackPhoto": "https://res.cloudinary.com/dlq45ttnp/image/upload/v1727281013/uploads/twavt93nauumayrnfafl.jpg",
//     "payment": true,
//     "createdAt": "2024-09-25T16:16:53.902Z",
//     "updatedAt": "2024-09-25T16:18:03.283Z",
//     "__v": 0,
//     "status": "pending"
// }
