import { useParams } from "react-router-dom";

function EditAthelete() {
    // url structure = /edit-athlete/:regNo
    const regNo = useParams().regNo;

    return <div>{regNo}</div>;
}

export default EditAthelete;
