import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/globals.css";
const PerformanceLab=lazy(()=>import("./views/PerformanceLab"));
const diagnostics=new URLSearchParams(location.search).get("laboratorio")==="1";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {diagnostics?<Suspense fallback={<p>Abriendo laboratorio…</p>}><PerformanceLab/></Suspense>:<App />}
  </React.StrictMode>,
);
