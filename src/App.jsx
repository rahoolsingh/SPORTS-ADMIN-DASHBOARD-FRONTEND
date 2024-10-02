import { useState } from "react";
import Login from "./components/Login/Login";
import AtheleteAllRecords from "./components/Athelete/AtheleteAllRecords";
import Header from "./components/Header/Header";
import AtheletePendingRecords from "./components/Athelete/PendingAtheleteRecords";
import CoachAllRecords from "./components/Coach/CoachAllRecords";
import CoachPendingRecords from "./components/Coach/PendingCoachRecords";

const Auth = () => {
    // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // not-login -> login
    const [stage, setStage] = useState("not-login");
    const [page, setPage] = useState("");

    return (
        <div className="flex flex-col items-center justify-between h-full min-h-screen">
            <Header
                stage={stage}
                setStage={setStage}
                page={page}
                setPage={setPage}
            />
            {stage === "not-login" && <Login setStage={setStage} />}

            {stage === "login" && page === "all-atheletes" && (
                <AtheleteAllRecords />
            )}

            {stage === "login" && page === "pending-atheletes" && (
                <AtheletePendingRecords />
            )}

            {stage === "login" && page === "all-coaches" && <CoachAllRecords />}

            {stage === "login" && page === "pending-coaches" && (
                <CoachPendingRecords />
            )}

            <footer className="p-4 bg-gray-800 text-gray-50 w-full mt-4">
                <img
                    src="https://raw.githubusercontent.com/rahoolsingh/Backend/refs/heads/master/public/assets/logo-white-border.png"
                    alt="logo"
                    className="h-full bg-white max-h-12 m-auto"
                />
                <div className="container mx-auto">
                    <p className="text-center text-sm mt-2">
                        Made with ❤️ by DRS Technology
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Auth;
