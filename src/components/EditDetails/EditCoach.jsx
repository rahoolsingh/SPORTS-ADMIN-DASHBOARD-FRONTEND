import { useParams } from "react-router-dom";

function EditCoach() {
    // url structure = /edit-coach/:regNo
    const regNo = useParams().regNo;
    return <div>{regNo}</div>;
}

export default EditCoach;
