import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Importing js-cookie to manage cookies
import CoachTable from "./CoachTable";
import propTypes from "prop-types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function CoachPendingRecords({ setLoading }) {
    const [coachData, setCoachData] = useState([]);

    // Function to fetch and show all records
    const handleShowAllRecords = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BACKEND_URL}/coach/pending-list`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                }
            );
            setCoachData(response.data);
            console.log("All Records:", response.data);
            setLoading(false);
        } catch (error) {
            console.error(
                "Error fetching records:",
                error.response ? error.response.data.message : error.message
            );
            setLoading(false);
        }
    };

    useEffect(() => {
        handleShowAllRecords();
    }, []);

    return <CoachTable coachData={coachData} setCoachData={setCoachData} />;
}

export default CoachPendingRecords;

CoachPendingRecords.propTypes = {
    setLoading: propTypes.func,
};
