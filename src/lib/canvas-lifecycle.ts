export function watchCanvasContext(canvas:Pick<HTMLCanvasElement,"addEventListener"|"removeEventListener">,onLost:()=>void):()=>void {
  let reported=false;
  const lost=(event:Event)=>{
    event.preventDefault();
    if(!reported){reported=true;onLost();}
  };
  canvas.addEventListener("webglcontextlost",lost);
  return()=>canvas.removeEventListener("webglcontextlost",lost);
}
