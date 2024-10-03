import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import EditCoach from "./components/EditDetails/EditCoach.jsx";
import EditAthelete from "./components/EditDetails/EditAthelete.jsx";
import "./index.css";
import NotFound from "./components/NotFound/NotFound.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/edit-coach/:regNo" element={<EditCoach />} />
                <Route path="/edit-athlete/:regNo" element={<EditAthelete />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
