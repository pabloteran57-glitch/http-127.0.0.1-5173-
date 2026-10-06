import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { summarizeFrames, type PerformanceResult, type PerformanceRun } from "../lib/performance";

export default function PerformanceProbe({run,onResult}: {run:PerformanceRun;onResult:(result:PerformanceResult)=>void}) {
  const {camera,invalidate}=useThree();
  const samples=useRef<number[]>([]), last=useRef<number|null>(null), start=useRef(0), done=useRef(false);
  const frameCount=useRef(0);
  const callback=useRef(onResult);callback.current=onResult;
  useEffect(()=>{
    samples.current=[];last.current=null;done.current=false;frameCount.current=0;start.current=performance.now();
    const finish=(status:PerformanceResult["status"])=>{
      if(done.current)return;done.current=true;
      callback.current(summarizeFrames(run,samples.current,performance.now()-start.current,status,frameCount.current));
    };
    const hidden=()=>{if(document.hidden)finish("interrupted");};
    const timer=window.setTimeout(()=>finish("completed"),run.duration_ms);
    document.addEventListener("visibilitychange",hidden);invalidate();
    return ()=>{window.clearTimeout(timer);document.removeEventListener("visibilitychange",hidden);done.current=true;};
  },[run,camera,invalidate]);
  useFrame(()=>{
    if(done.current)return;
    const now=performance.now();
    frameCount.current++;
    if(last.current!==null)samples.current.push(now-last.current);
    last.current=now;
    if(run.workload==="orbit"){
      // Sólo mueve la cámara del visor; no simula movimiento mecánico del rig.
      const angle=(now-start.current)/4000;
      camera.position.set(Math.sin(angle)*9,2.2,Math.cos(angle)*9);
      camera.lookAt(-.25,-1.1,0);invalidate();
    }
  });
  return null;
}
