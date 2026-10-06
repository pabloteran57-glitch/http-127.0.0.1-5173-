export async function prepareOffline():Promise<string>{
  if(!__PUBLIC_DEMO__)throw new Error("Disponible en la compilación pública, no en desarrollo.");
  if(!("serviceWorker" in navigator)||!window.isSecureContext)throw new Error("Este navegador no permite preparar recursos sin conexión.");
  const registration=await navigator.serviceWorker.register("/sw.js",{scope:"/",updateViaCache:"none"});
  const worker=registration.installing??registration.waiting??registration.active;
  if(!worker)throw new Error("No se pudo iniciar la preparación sin conexión.");
  if(!["installed","activated"].includes(worker.state))await new Promise<void>((resolve,reject)=>{
    const timeout=window.setTimeout(()=>{worker.removeEventListener("statechange",change);reject(new Error("La preparación tarda demasiado; no se confirmó disponibilidad sin conexión."));},30000);
    const change=()=>{if(["installed","activated","redundant"].includes(worker.state)){window.clearTimeout(timeout);worker.removeEventListener("statechange",change);if(worker.state==="redundant")reject(new Error("Falló la descarga de los recursos. No se confirmó uso sin conexión."));else resolve();}};
    worker.addEventListener("statechange",change);change();
  });
  try{localStorage.setItem("takegrid.offline.enabled","1");}catch{/* No cambia la disponibilidad de los recursos ya preparados. */}
  return registration.waiting&&registration.active?"Recursos de la nueva versión preparados. Guarda tus planes y cierra las pestañas de Takegrid para activarla; no se recargaron tus borradores.":"Recursos propios preparados. Al volver a abrir Takegrid podrás usar tus planes locales sin red; los enlaces oficiales y las fuentes tipográficas externas necesitan conexión.";
}
