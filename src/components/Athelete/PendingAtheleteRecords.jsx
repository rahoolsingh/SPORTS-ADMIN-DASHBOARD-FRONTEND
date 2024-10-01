import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Importing js-cookie to manage cookies
import AtheleteTable from "./AtheleteTable";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function AtheletePendingRecords() {
    const [atheleteData, setAtheleteData] = useState([]);

    // Function to fetch and show all records
    const handleShowAllRecords = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/athelete/pending-list`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                }
            );
            setAtheleteData(response.data);
            console.log("All Records:", response.data);
        } catch (error) {
            console.error(
                "Error fetching records:",
                error.response ? error.response.data.message : error.message
            );
        }
    };

    useEffect(() => {
        handleShowAllRecords();
    }, []);

    return <AtheleteTable atheleteData={atheleteData} />;
}

export default AtheletePendingRecords;
