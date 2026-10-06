import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/globals.css";
const PerformanceLab=lazy(()=>import("./views/PerformanceLab"));
const diagnostics=new URLSearchParams(location.search).get("laboratorio")==="1";
const recoveryTest=import.meta.env.DEV&&new URLSearchParams(location.search).get("prueba-visor")==="1";
const ViewerRecoveryLab=import.meta.env.DEV?lazy(()=>import("./views/ViewerRecoveryLab")):null;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {recoveryTest&&ViewerRecoveryLab?<Suspense fallback={<p>Abriendo prueba local...</p>}><ViewerRecoveryLab/></Suspense>:diagnostics?<Suspense fallback={<p>Abriendo laboratorio…</p>}><PerformanceLab/></Suspense>:<App />}
  </React.StrictMode>,
);
