import propTypes from "prop-types";

function AtheleteTable({ atheleteData }) {
    return (
        <div className="w-full p-4">
            {atheleteData.map((data) => (
                <AtheleteCard Data={data} key={data.regNo} />
            ))}
        </div>
    );
}

export default AtheleteTable;

function AtheleteCard({ Data }) {
    return (
        <div
            className={`
            ${
                Data.status === "pending"
                    ? "border-yellow-400 bg-yellow-400"
                    : Data.status === "app bg-roved"
                    ? "border-green-400 bg-green-400"
                    : "border-red-400 bg-red-400"
            }
            bg-opacity-10
            w-full p-4 border bg-slate-800 rounded-lg mt-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-y-3 gap-x-2
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
                    <p className="text-xs text-slate-50 break-all">
                        {String(Data[field.name]).toUpperCase()}
                    </p>
                </div>
            ))}

            {DocumentFields.map((field) => (
                <div className="col-span-1" key={field.name}>
                    <p className="font-semibold">{field.label}</p>
                    <a
                        href={Data[field.name]}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500"
                    >
                        View Document
                    </a>
                </div>
            ))}

            <div className="md:col-span-2 flex justify-end items-center text-sm">
                {Data.status === "pending" && (
                    <>
                        <button className="bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-800 font-medium">
                            <i className="fas fa-check mr-1"></i>
                            <span>Mark Approved</span>
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-800 ml-2">
                            <i className="fas fa-times mr-1"></i>
                            Reject
                        </button>
                    </>
                )}

                {Data.status === "approved" && (
                    <button className="bg-yellow-600 text-white px-3 py-1 rounded-full hover:bg-yellow-800 ml-2">
                        <i className="fas fa-redo mr-1"></i>
                        Resend ID Card
                    </button>
                )}
            </div>
        </div>
    );
}

AtheleteTable.propTypes = {
    atheleteData: propTypes.array,
};

AtheleteCard.propTypes = {
    Data: propTypes.object,
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
