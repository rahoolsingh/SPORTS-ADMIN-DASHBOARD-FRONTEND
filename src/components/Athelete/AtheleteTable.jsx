import propTypes from "prop-types";
import ConfirmationPopup from "../Modals/ConfirmationPopup";
import { useState } from "react";
import Cookies from "js-cookie"; // Importing js-cookie to manage cookies
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function AtheleteTable({ atheleteData, setAtheleteData }) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationConfig, setConfirmationConfig] = useState({});
    const [statusMessage, setStatusMessage] = useState(""); // State for status message
    const [statusType, setStatusType] = useState(""); // State for status type (success/error)

    const showStatusCard = (message, type) => {
        setStatusMessage(message);
        setStatusType(type);
        setTimeout(() => {
            setStatusMessage(""); // Hide after 3 seconds
        }, 3000);
    };

    const handleApprove = async (regNo) => {
        try {
            const response = await axios.put(
                `${BACKEND_URL}/athelete/mark-approved/${regNo}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                }
            );
            console.log("Approved:", response.data);
            setAtheleteData((prevData) =>
                prevData.filter((data) => data.regNo !== regNo)
            );
            showStatusCard(`Approved: ${response.data.message}`, "success"); // Make sure the response contains a message
        } catch (error) {
            console.error(
                "Error approving record:",
                error.response ? error.response.data.message : error.message
            );
            showStatusCard(
                `Error: ${
                    error.response ? error.response.data.message : error.message
                }`,
                "error"
            );
        }
    };

    const handleReject = async (regNo) => {
        try {
            const response = await axios.put(
                `${BACKEND_URL}/athelete/mark-rejected/${regNo}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                }
            );
            setAtheleteData((prevData) =>
                prevData.filter((data) => data.regNo !== regNo)
            );
            console.log("Rejected:", response.data);
            showStatusCard(`Rejected: ${response.data.message}`, "success");
        } catch (error) {
            console.error(
                "Error rejecting record:",
                error.response ? error.response.data.message : error.message
            );
            showStatusCard(
                `Error: ${
                    error.response ? error.response.data.message : error.message
                }`,
                "error"
            );
        }
    };

    return (
        <div className="w-full p-4">
            {showConfirmation && (
                <ConfirmationPopup
                    message={confirmationConfig.message}
                    confirmFunction={confirmationConfig.confirmFunction}
                    setShowConfirmation={setShowConfirmation}
                />
            )}

            {statusMessage && ( // Show status card if there is a message
                <div
                    className={`status-card fixed bottom-4 right-4 p-2 rounded text-white ${
                        statusType === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    {statusMessage}
                </div>
            )}

            <p>
                Live Count:{" "}
                <span className="text-yellow-500 font-semibold">
                    {atheleteData.length}
                </span>
            </p>

            {atheleteData.map((data) => (
                <AtheleteCard
                    Data={data}
                    key={data.regNo}
                    setShowConfirmation={setShowConfirmation}
                    setConfirmationConfig={setConfirmationConfig}
                    handleApprove={handleApprove}
                    handleReject={handleReject}
                />
            ))}
        </div>
    );
}

export default AtheleteTable;

AtheleteTable.propTypes = {
    atheleteData: propTypes.array,
    setAtheleteData: propTypes.func,
};

function AtheleteCard({
    Data,
    setShowConfirmation,
    setConfirmationConfig,
    handleApprove,
    handleReject,
}) {
    return (
        <>
            <div
                className={`
            ${
                Data.status === "pending"
                    ? "border-yellow-400 bg-yellow-400"
                    : Data.status === "approved"
                    ? "border-green-400 bg-green-400"
                    : "border-red-400 bg-red-400"
            }
            bg-opacity-10
            w-full p-4 border bg-slate-800 mt-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-y-3 gap-x-2
        `}
            >
                <div className="col-span-1">
                    <p className="font-semibold">Status</p>
                    <p className="space-x-1">
                        <span
                            className={`${
                                Data.status === "pending"
                                    ? "bg-yellow-500"
                                    : Data.status === "approved"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            } w-2 h-2 rounded-full inline-block`}
                        ></span>

                        <span
                            className={`${
                                Data.status === "pending"
                                    ? "text-yellow-500"
                                    : Data.status === "approved"
                                    ? "text-green-500"
                                    : "text-red-500"
                            } text-xs`}
                        >
                            {String(Data.status).toUpperCase()}
                        </span>
                    </p>
                </div>
                {fields.map((field) => (
                    <div className="col-span-1" key={field.name}>
                        <p className="font-semibold">{field.label}</p>
                        <p className="text-xs break-all">
                            {String(Data[field.name]).toUpperCase()}
                        </p>
                    </div>
                ))}

                {DocumentFields.map((field) => (
                    <div className="col-span-1" key={field.name}>
                        <p className="font-semibold">{field.label}</p>
                        {/* small preview thumbnial */}
                        {Data[field.name] && (
                            <img
                                src={Data[field.name]}
                                alt="preview"
                                className="h-16 object-cover mt-2"
                            />
                        )}
                        {Data[field.name] ? (
                            <a
                                href={Data[field.name]}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-500"
                            >
                                View Document
                            </a>
                        ) : (
                            <p className="text-xs text-red-500">
                                ERROR: Invalid Document
                                <span className="text-xs text-red-500 block">
                                    ID Card will not be generated
                                </span>
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <div className="md:col-span-2 flex justify-end items-center text-sm">
                {Data.status === "pending" && (
                    <>
                        <button
                            onClick={() => {
                                setShowConfirmation(true);
                                setConfirmationConfig({
                                    message: `Are you sure you want to approve ${Data.athleteName}'s application?`,
                                    confirmFunction: () => {
                                        console.log("Approving:", Data.regNo);
                                        handleApprove(Data.regNo);
                                    },
                                });
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded-b hover:bg-green-800 font-medium"
                        >
                            <i className="fas fa-check mr-1"></i>
                            <span>Mark Approved</span>
                        </button>
                        <button
                            onClick={() => {
                                setShowConfirmation(true);
                                setConfirmationConfig({
                                    message: `Are you sure you want to reject ${Data.athleteName}'s application?`,
                                    confirmFunction: () => {
                                        handleReject(Data.regNo);
                                    },
                                });
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded-b hover:bg-red-800 ml-2"
                        >
                            <i className="fas fa-times mr-1"></i>
                            Reject
                        </button>
                    </>
                )}

                <a
                    href={`edit-athlete/${Data.regNo}`}
                    target="_blank"
                    className="bg-blue-600 text-white px-3 py-1 rounded-b hover:bg-blue-800 ml-2"
                >
                    <i className="fas fa-edit mr-1"></i>
                    Edit
                </a>
            </div>
        </>
    );
}

AtheleteTable.propTypes = {
    atheleteData: propTypes.array,
    handleApprove: propTypes.func,
    handleReject: propTypes.func,
};

AtheleteCard.propTypes = {
    Data: propTypes.object,
    setShowConfirmation: propTypes.func,
    setConfirmationConfig: propTypes.func,
    handleApprove: propTypes.func,
    handleReject: propTypes.func,
};

const DocumentFields = [
    {
        name: "photo",
        label: "Photo",
    },
    {
        name: "certificate",
        label: "Birth Certificate",
    },
    {
        name: "residentCertificate",
        label: "Resident Certificate",
    },
    {
        name: "adharFrontPhoto",
        label: "Adhar Front Photo",
    },
    {
        name: "adharBackPhoto",
        label: "Adhar Back Photo",
    },
];

const fields = [
    {
        name: "regNo",
        label: "Tracking Number",
    },
    {
        name: "athleteName",
        label: "Athlete Name",
    },
    {
        name: "fatherName",
        label: "Father Name",
    },
    {
        name: "motherName",
        label: "Mother Name",
    },
    {
        name: "dob",
        label: "Date of Birth",
    },
    {
        name: "gender",
        label: "Gender",
    },
    {
        name: "district",
        label: "District",
    },
    {
        name: "mob",
        label: "Mobile Number",
    },
    {
        name: "email",
        label: "Email",
    },
    {
        name: "adharNumber",
        label: "Adhar Number",
    },
    {
        name: "address",
        label: "Address",
    },
    {
        name: "pin",
        label: "Pincode",
    },
    {
        name: "academyName",
        label: "Academy Name",
    },
    {
        name: "coachName",
        label: "Coach Name",
    },
    {
        name: "status",
        label: "Status",
    },
    {
        name: "payment",
        label: "Payment",
    },
    {
        name: "createdAt",
        label: "Created At",
    },
];
