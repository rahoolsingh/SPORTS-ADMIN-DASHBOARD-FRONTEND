import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import EditCoach from "./EditCoach.jsx";
import EditAthelete from "./EditAthelete.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/edit-coach/:regNo" element={<EditCoach />} />
                <Route path="/edit-athlete/:regNo" element={<EditAthelete />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
