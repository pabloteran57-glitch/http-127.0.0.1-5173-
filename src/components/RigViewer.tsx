import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { CubicBezierLine } from "@react-three/drei/core/CubicBezierLine";
import { Edges } from "@react-three/drei/core/Edges";
import { Line } from "@react-three/drei/core/Line";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { RoundedBox } from "@react-three/drei/core/RoundedBox";
import { Box3, Euler, Group, Mesh, PerspectiveCamera, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { cableById, cablesData, layoutData, modelAssets, partById, portById } from "../data";
import type { LayoutNode, Variant, Vec3 } from "../lib/types";
import { connectionName } from "../lib/ui";
import { cableForVariant, hiddenSubassemblies, layoutForVariant, nodePose, routeOffset, visibleCableIds } from "../lib/viewer";
import PerformanceProbe from "./PerformanceProbe";
import type { PerformanceResult, PerformanceRun } from "../lib/performance";
import { approvedModelFor } from "../lib/model-assets";
import { modelReadiness, modelSessionKey, updateModelReports, type ModelLoadReport, type ModelReports } from "../lib/model-runtime";

const ApprovedModel = lazy(() => import("./ApprovedModel"));

export type ViewAngle = "iso" | "side" | "front";
interface Props {
  exploded: boolean;
  showCables: boolean;
  showLabels: boolean;
  variant: Variant;
  selectedId: string;
  onSelect: (id: string) => void;
  angle: ViewAngle;
  selectedCableId: string | null;
  resetKey: number;
  highlightIds?: string[];
  contextIds?: string[];
  reveal?: boolean;
  framing?: "gimbal" | "handheld";
  framingVariant?: Variant;
  sceneKey?: string;
  onSceneReady?: () => void;
  onScenePreparing?: () => void;
  onUnavailable?: () => void;
  onInteract?: () => void;
  performanceRun?: PerformanceRun;
  onPerformanceResult?: (result: PerformanceResult) => void;
}
const scale = (v: number) => v / 100;
const vector = (values: Vec3): Vec3 => values.map(scale) as Vec3;
const primaryKinds = new Set<LayoutNode["kind"]>(["camera", "lens", "matte", "battery", "monitor", "grip", "audioReceiver"]);

function EnvelopeGeometry({node,selected}:{node:LayoutNode;selected:boolean}) {
  const size=vector(node.size_xyz_mm);
  return <RoundedBox args={size} radius={Math.min(...size,.04)/6} smoothness={2}>
    <meshStandardMaterial color="#587579" transparent opacity={selected ? .55 : .28} metalness={.1} roughness={.8}/>
    <Edges color={selected?"#a2ded1":"#597479"}/>
  </RoundedBox>;
}

function AnimatedNode({ node, exploded, vertical, selected, onSelect, context, reveal, attempt, scene, onModelReport,hiddenObjectNames }: {
  node: LayoutNode; exploded: boolean; vertical: boolean; selected: boolean; onSelect: (id: string) => void; context:boolean; reveal:boolean;
  attempt: number; scene: string; onModelReport: (report: ModelLoadReport) => void;
  hiddenObjectNames:string[];
}) {
  const group = useRef<Group>(null);
  const pose = nodePose(node,vertical,exploded);
  const asset = approvedModelFor(node, partById[node.id], modelAssets);
  const pos = vector(pose.position_mm);
  const target = useRef(new Vector3());
  const unitScale = useRef(new Vector3(1, 1, 1));
  const invalidate = useThree(state => state.invalidate);
  target.current.set(...pos);
  const initialScale=useRef(reveal&&!window.matchMedia("(prefers-reduced-motion:reduce)").matches?0.01:1);
  useFrame((_, delta) => {
    if (!group.current) return;
    const elapsed = Math.min(delta, .05);
    group.current.position.lerp(target.current, Math.min(elapsed * 8, 1));
    group.current.scale.lerp(unitScale.current, Math.min(elapsed * 7, 1));
    if (group.current.position.distanceToSquared(target.current) > .000001 || group.current.scale.distanceToSquared(unitScale.current) > .000001) invalidate();
  });
  useEffect(()=>{
    if(!context||asset)return;
    const restore:(()=>void)[]=[];
    group.current?.traverse(object=>{if(object instanceof Mesh){for(const material of Array.isArray(object.material)?object.material:[object.material]){const opacity=material.opacity,transparent=material.transparent,depthWrite=material.depthWrite;material.opacity=opacity*.18;material.transparent=true;material.depthWrite=false;restore.push(()=>{material.opacity=opacity;material.transparent=transparent;material.depthWrite=depthWrite;});}}});
    return ()=>restore.forEach(reset=>reset());
  },[context,selected,asset]);
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(node.id); };
  const rotation = pose.rotation_deg.map(v=>v*Math.PI/180) as Vec3;
  return <group ref={group} position={pos} scale={initialScale.current} onClick={click}>
    <group rotation={rotation}>
      {asset ? <Suspense fallback={<EnvelopeGeometry node={node} selected={selected}/>}><ApprovedModel key={`${asset.id}:${asset.artifact.sha256}:${attempt}`} asset={asset} selected={selected} context={context} reportKey={modelSessionKey(asset, attempt, scene)} onReport={onModelReport} hiddenObjectNames={hiddenObjectNames} fallback={<EnvelopeGeometry node={node} selected={selected}/>} /></Suspense> : <EnvelopeGeometry node={node} selected={selected}/>}
    </group>
  </group>;
}
function LabelProjector({ nodes, exploded, vertical, elements }: { nodes: LayoutNode[]; exploded: boolean; vertical:boolean; elements: React.RefObject<Record<string, HTMLButtonElement | null>> }) {
  const point = new Vector3();
  useFrame(({ camera, size }) => {
    for (const node of nodes) {
      const element = elements.current[node.id];
      if (!element) continue;
      const pos = vector(nodePose(node,vertical,exploded).position_mm);
      point.set(pos[0], pos[1] + node.size_xyz_mm[1] / 200 + 0.24, pos[2]);
      if (node.kind === "matte") point.y += 0.36;
      if (node.kind === "lens") { point.x += 0.26; point.y += 0.13; }
      if (node.kind === "camera") { point.x -= 0.45; point.y += 0.1; }
      if (node.kind === "audioReceiver") { point.x -= .25; point.y += .32; }
      point.project(camera);
      element.style.transform = `translate(-50%, -100%) translate(${(point.x * 0.5 + 0.5) * size.width}px, ${(-point.y * 0.5 + 0.5) * size.height}px)`;
      element.style.visibility = point.z > 1 || point.z < -1 ? "hidden" : "visible";
    }
  });
  return null;
}
function CameraControls({ angle, exploded, nodes, vertical, resetKey, onInteract }: { angle: ViewAngle; exploded: boolean; nodes:LayoutNode[]; vertical:boolean; resetKey: number; onInteract?: () => void }) {
  const { camera, invalidate, size } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const envelopeKey=JSON.stringify(nodes.map(n=>[n.id,n.position_mm,n.rotation_deg,n.size_xyz_mm,n.explode_mm]));
  useEffect(() => {
    if(!(camera instanceof PerspectiveCamera)||!nodes.length)return;
    const bounds=new Box3(),corners:Vector3[]=[];
    for(const node of nodes){
      const pose=nodePose(node,vertical,exploded),rotation=new Euler(...pose.rotation_deg.map(v=>v*Math.PI/180) as Vec3),position=new Vector3(...vector(pose.position_mm));
      for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1]){
        const point=new Vector3(x*scale(node.size_xyz_mm[0])/2,y*scale(node.size_xyz_mm[1])/2,z*scale(node.size_xyz_mm[2])/2).applyEuler(rotation).add(position);corners.push(point);bounds.expandByPoint(point);
      }
    }
    const center=bounds.getCenter(new Vector3());
    const directions:Record<ViewAngle,Vec3>={iso:[-6,3.3,-7.5],side:[-9,1,0.2],front:[0,0.7,10]};
    const direction=new Vector3(...directions[angle]).normalize(),right=new Vector3(0,1,0).cross(direction).normalize(),up=direction.clone().cross(right);
    const tanV=Math.tan(camera.fov*Math.PI/360),tanH=tanV*size.width/Math.max(size.height,1);
    // Envolventes de planificación: margen visual, nunca prueba de colisión mecánica.
    const distance=Math.max(3,...corners.map(point=>{const relative=point.clone().sub(center);return relative.dot(direction)+1.2*Math.max(Math.abs(relative.dot(right))/tanH,Math.abs(relative.dot(up))/tanV);}));
    camera.position.copy(center).addScaledVector(direction,distance);
    camera.lookAt(center);
    if (controls.current) { controls.current.target.copy(center);controls.current.maxDistance=Math.max(18,distance*4);controls.current.update(); }
    invalidate();
  }, [angle, camera, exploded, vertical, envelopeKey, resetKey, invalidate, size.width, size.height]);
  return <OrbitControls ref={controls} onStart={onInteract} minDistance={3} maxDistance={18} maxPolarAngle={Math.PI * 0.9} enableDamping dampingFactor={0.08} />;
}
function SceneReady({ sceneKey, settled, onReady, onPreparing }: { sceneKey?: string; settled: boolean; onReady?: () => void; onPreparing?: () => void }) {
  const invalidate = useThree(state => state.invalidate);
  const frames = useRef(0);
  const callback = useRef(onReady);
  const preparing = useRef(onPreparing);
  callback.current = onReady;
  preparing.current = onPreparing;
  useEffect(() => { frames.current = 0; preparing.current?.(); invalidate(); }, [sceneKey, settled, invalidate]);
  useFrame(() => {
    if (!settled || frames.current >= 2) return;
    frames.current += 1;
    if (frames.current === 2) callback.current?.();
    else invalidate();
  });
  return null;
}
class ViewerBoundary extends Component<{ children: ReactNode; onUnavailable?: () => void; onRetry: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable?.(); }
  render() {
    return this.state.failed ? <div className="viewer-fallback viewer-recovery" role="status"><p>No se pudo abrir el visor 3D. Tu selección y la guía siguen disponibles.</p><button className="quiet-button" onClick={this.props.onRetry}>Reintentar visor</button></div> : this.props.children;
  }
}
function PortProjection({anchors,elements}:{anchors:{id:string;position:Vec3}[];elements:React.RefObject<Record<string,HTMLSpanElement|null>>}){
 const point=new Vector3();
 useFrame(({camera,size})=>anchors.forEach(a=>{const el=elements.current[a.id];if(!el)return;point.set(...a.position).project(camera);el.style.transform=`translate(-50%,-50%) translate(${(point.x*.5+.5)*size.width}px,${(-point.y*.5+.5)*size.height}px)`;el.style.visibility=point.z>1||point.z< -1?"hidden":"visible";}));
 return null;
}
export default function RigViewer({exploded,showCables,showLabels,variant,selectedId,onSelect,angle,selectedCableId,resetKey,highlightIds=[],contextIds=[],reveal=false,framing,framingVariant,sceneKey,onSceneReady,onScenePreparing,onUnavailable,onInteract,performanceRun,onPerformanceResult}:Props){
 const labels=useRef<Record<string,HTMLButtonElement|null>>({});const portLabels=useRef<Record<string,HTMLSpanElement|null>>({});
 const [attempt,setAttempt]=useState(0),[unavailable,setUnavailable]=useState(false);
 const [modelReports,setModelReports]=useState<ModelReports>({});
 const nodes=layoutForVariant(variant,layoutData).nodes.filter(n=>variant.active_part_ids.includes(n.id));
 const session=sceneKey??`${variant.id}:${nodes.map(n=>n.id).join(",")}`;
 const modelEntries=nodes.flatMap(node=>{const asset=approvedModelFor(node,partById[node.id],modelAssets);return asset?[{asset,key:modelSessionKey(asset,attempt,session)}]:[];});
 const modelKeys=modelEntries.map(entry=>entry.key),readiness=modelReadiness(modelKeys,modelReports);
 const reportModel=(report:ModelLoadReport)=>setModelReports(previous=>updateModelReports(previous,modelKeys,report));
 const retry=()=>{onInteract?.();setUnavailable(false);setAttempt(value=>value+1);onScenePreparing?.();};
 const vertical=variant.viewer.mode==="vertical";
 const handheld=framing?framing==="handheld":variant.viewer.rig_context!=="gimbal";
 const positions=Object.fromEntries(nodes.map(n=>[n.id,vector(nodePose(n,vertical,exploded).position_mm)]));
 const endpoint=(portId:string):Vec3|null=>{
   const port=portById[portId]; const node=nodes.find(n=>n.id===port?.part_id);
   if(!node||!port.local_position_mm)return null;
   const r=nodePose(node,vertical,exploded).rotation_deg.map(v=>v*Math.PI/180) as Vec3;
   const p=new Vector3(...vector(port.local_position_mm)).applyEuler(new Euler(...r)).add(new Vector3(...positions[node.id]));
   return [p.x,p.y,p.z];
 };
 const links=variant.cable_profile_ids.map(id=>({cable:cableForVariant(cableById[id],variant),a:endpoint(cableById[id].from_port_id),b:endpoint(cableById[id].to_port_id)})).filter(l=>l.a&&l.b&&l.cable.display_kind==="cable");
 const focus=links.find(l=>l.cable.cable_id===selectedCableId);
 const visibleIds=visibleCableIds(links.map(link=>link.cable.cable_id),showCables,selectedCableId);
 const visibleLinks=links.filter(link=>visibleIds.includes(link.cable.cable_id));
 const anchors=focus?[{id:"a",position:focus.a!},{id:"b",position:focus.b!}]:[];
 const route=cableById[selectedCableId??""];
 return <div className="rig-stage" aria-label="Visor 3D del rig, geometría aproximada" data-visible-parts={nodes.map(n=>n.id).join(",")} data-visible-cables={visibleIds.join(",")} data-context-parts={contextIds.join(",")} data-models-loading={readiness.loading.length} data-models-failed={readiness.failed.length} data-viewer-unavailable={unavailable}>
  <div className="stage-corner">MODELO DE PLANIFICACIÓN <span>Geometría aproximada</span></div>
  <ViewerBoundary key={attempt} onRetry={retry} onUnavailable={()=>{setUnavailable(true);onUnavailable?.();}}><Suspense fallback={<div className="viewer-fallback">Iniciando visor...</div>}><Canvas frameloop={performanceRun?.policy??"demand"} camera={{position:[-6,2.2,-7.5],fov:36}} dpr={[1,1.5]} gl={{antialias:true,alpha:true}}>
   <ambientLight intensity={1.6}/><directionalLight position={[-3,7,-6]} intensity={4.5} color="#f1f2ff"/><directionalLight position={[5,3,5]} intensity={3} color="#aec3d8"/><pointLight position={[-3,-2,-3]} intensity={14} color="#7cacae"/>
   <gridHelper args={[20,40,"#3d434c","#242933"]} position={[0,handheld?-.8:-3.6,0]}/>
   {nodes.map(n=><AnimatedNode key={n.id} node={n} exploded={exploded} vertical={variant.viewer.mode==="vertical"} selected={(selectedId===n.id&&!selectedCableId)||highlightIds.includes(n.id)} onSelect={onSelect} context={contextIds.includes(n.id)} reveal={reveal} attempt={attempt} scene={session} onModelReport={reportModel} hiddenObjectNames={hiddenSubassemblies(n,variant)}/>)}
   {visibleLinks.map(({cable:c,a,b})=>{
    const focused=c.cable_id===selectedCableId;const color=cablesData.color_coding[c.type==="data"?"control":c.type];
    const opacity=selectedCableId&&!focused ? .18 : 1;
    const offsetA=routeOffset(c.route_control_offsets_mm!.a as Vec3,c.route_control_frame==="camera",vertical);
    const offsetB=routeOffset(c.route_control_offsets_mm!.b as Vec3,c.route_control_frame==="camera",vertical);
    const midA=a!.map((v,i)=>v+scale(offsetA[i])) as Vec3;
    const midB=b!.map((v,i)=>v+scale(offsetB[i])) as Vec3;
    return <group key={c.cable_id}>{exploded?<Line points={[a!,b!]} dashed dashSize={.1} gapSize={.06} color={color} lineWidth={focused?4:2.5} transparent opacity={opacity} depthTest={false}/>:<CubicBezierLine start={a!} end={b!} midA={midA} midB={midB} color={color} lineWidth={focused?4.5:2.7} transparent opacity={opacity} depthTest={false}/>}
     {(focused||!selectedCableId)&&[a!,b!].map((point,i)=><mesh key={i} position={point}><sphereGeometry args={[focused ? .04 : .025,20,16]}/><meshBasicMaterial color={color} depthTest={false}/></mesh>)}
    </group>;
   })}
   <CameraControls angle={angle} exploded={exploded} nodes={framingVariant?layoutForVariant(framingVariant,layoutData).nodes.filter(n=>framingVariant.active_part_ids.includes(n.id)):nodes} vertical={(framingVariant??variant).viewer.mode==="vertical"} resetKey={resetKey} onInteract={onInteract}/><LabelProjector nodes={nodes} exploded={exploded} vertical={vertical} elements={labels}/><PortProjection anchors={anchors} elements={portLabels}/><SceneReady sceneKey={`${session}:${attempt}`} settled={readiness.settled} onReady={onSceneReady} onPreparing={onScenePreparing}/>
   {performanceRun&&onPerformanceResult&&<PerformanceProbe key={performanceRun.id} run={performanceRun} onResult={onPerformanceResult}/>}
  </Canvas></Suspense></ViewerBoundary>
  {!unavailable&&<div className="label-layer">{nodes.filter(n=>showLabels&&primaryKinds.has(n.kind)||(!selectedCableId&&n.id===selectedId)).map(n=><button key={n.id} ref={el=>{labels.current[n.id]=el}} className={n.id===selectedId?"part-label selected":"part-label"} onClick={()=>onSelect(n.id)}>{n.label}</button>)}
   {focus&&anchors.map((a,i)=><span key={a.id} ref={el=>{portLabels.current[a.id]=el}} className="port-marker"><b>{i?"B":"A"}</b>{portById[i?focus.cable.to_port_id:focus.cable.from_port_id].label}</span>)}
  </div>}
  {!unavailable&&modelEntries.length>0&&(readiness.loading.length>0||readiness.failed.length>0)&&<div className="model-load-status" role="status"><span>{readiness.loading.length>0?`Cargando ${readiness.loading.length} ${readiness.loading.length===1?"modelo":"modelos"}. Geometría aproximada de respaldo visible.`:`${readiness.failed.length} ${readiness.failed.length===1?"modelo no disponible":"modelos no disponibles"}. Mostrando geometría aproximada de respaldo.`}</span>{readiness.failed.length>0&&<button className="quiet-button" onClick={retry}>Reintentar modelos</button>}</div>}
  {!unavailable&&selectedCableId&&<div className="route-hud" style={{"--route-color":route?cablesData.color_coding[route.type==="data"?"control":route.type]:undefined} as React.CSSProperties}><span className="eyebrow">{focus?"RECORRIDO RESALTADO":route?.display_kind==="contacts"?"CONTACTOS / SIN CABLE":route?.display_kind==="internal"?"ALIMENTACIÓN INTERNA":"CONEXIÓN SIN GEOMETRÍA VALIDADA"}</span><strong>{connectionName(selectedCableId)}</strong><p>{route?.display_kind!=="cable"?"Acople nativo ilustrativo. Verificar retención y contactos reales.":exploded?"En despiece: vínculo lógico, cable desconectado.":"Anclajes y bucles aproximados. No valida radios ni despejes."}</p></div>}
  <div className="stage-footer"><span>{unavailable?"GUÍA Y PIEZAS DISPONIBLES SIN 3D":"ARRASTRA PARA GIRAR / ACERCA O ALEJA"}</span><span>{unavailable?"VISOR NO DISPONIBLE":modelEntries.length<nodes.length||readiness.loading.length||readiness.failed.length?"Envolventes ilustrativas visibles; sin detalle mecánico":"Forma reconstruida con fotos y cotas, no CAD"}</span></div>
 </div>;
}
