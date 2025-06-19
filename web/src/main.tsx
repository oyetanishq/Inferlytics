import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";

import Home from "@/pages/table/index";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Home />
    </StrictMode>
);
