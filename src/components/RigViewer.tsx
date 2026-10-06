import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { CubicBezierLine } from "@react-three/drei/core/CubicBezierLine";
import { Edges } from "@react-three/drei/core/Edges";
import { Line } from "@react-three/drei/core/Line";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { RoundedBox } from "@react-three/drei/core/RoundedBox";
import { Euler, Group, Mesh, Path, Shape, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { cableById, cablesData, layoutData, portById } from "../data";
import type { LayoutNode, Variant, Vec3 } from "../lib/types";
import { connectionName } from "../lib/ui";
import { nodePose, routeOffset, visibleCableIds } from "../lib/viewer";
import PerformanceProbe from "./PerformanceProbe";
import type { PerformanceResult, PerformanceRun } from "../lib/performance";

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
  sceneKey?: string;
  onSceneReady?: () => void;
  onUnavailable?: () => void;
  onInteract?: () => void;
  performanceRun?: PerformanceRun;
  onPerformanceResult?: (result: PerformanceResult) => void;
}
const scale = (v: number) => v / 100;
const vector = (values: Vec3): Vec3 => values.map(scale) as Vec3;
const primaryLabels = new Set(["sony-fx3", "sony-fe-16-35-gm", "smallrig-3645", "smallrig-vb99-pro", "smallhd-indie-7", "dji-rs-bg70", "dji-mic-2-kit"]);
const graphite = "#252b2c";

function Block({ size, at = [0, 0, 0], color = graphite, selected = false, radius = 0.025 }: {
  size: Vec3; at?: Vec3; color?: string; selected?: boolean; radius?: number;
}) {
  return <RoundedBox args={size} position={at} radius={radius} smoothness={3}>
    <meshStandardMaterial color={color} metalness={0.6} roughness={0.43}
      emissive={selected ? "#62958d" : "#000000"} emissiveIntensity={selected ? 0.16 : 0} />
    {selected && <Edges color="#a2ded1" threshold={30} />}
  </RoundedBox>;
}
function Cylinder({ radius, length, at = [0, 0, 0], axis = "z", color = graphite }: {
  radius: number; length: number; at?: Vec3; axis?: "x" | "y" | "z"; color?: string;
}) {
  const rotation: Vec3 = axis === "z" ? [Math.PI / 2, 0, 0] : axis === "x" ? [0, 0, Math.PI / 2] : [0, 0, 0];
  return <mesh position={at} rotation={rotation}>
    <cylinderGeometry args={[radius, radius, length, 40]} />
    <meshStandardMaterial color={color} metalness={0.65} roughness={0.38} />
  </mesh>;
}
function Bolt({ at }: { at: Vec3 }) {
  return <Cylinder radius={0.028} length={0.016} at={at} color="#626968" />;
}

function RodClamp({w=0.8,h=0.26,d=0.35,at=[0,0,0] as Vec3,selected=false}:{w?:number;h?:number;d?:number;at?:Vec3;selected?:boolean}){
  const face=new Shape();face.moveTo(-w/2,-h/2);face.lineTo(w/2,-h/2);face.lineTo(w/2,h/2);face.lineTo(-w/2,h/2);face.closePath();
  for(const x of [-0.3,0.3]){const hole=new Path();hole.absarc(x,-0.01,0.075,0,Math.PI*2,true);face.holes.push(hole);}
  return <group position={at}><mesh position={[0,0,-d/2]}><extrudeGeometry args={[face,{depth:d,bevelEnabled:false,curveSegments:32}]}/><meshStandardMaterial color={selected?"#758a8a":"#303338"} metalness={.8} roughness={.4}/></mesh>{[-1,1].map(s=><group key={s}><Cylinder radius={.04} length={.08} axis="x" at={[s*(w/2+.025),-.015,0]} color="#85898b"/><Block size={[.024,.14,.09]} at={[s*(w/2+.06),-.06,0]} color="#1e2023" radius={.008}/></group>)}</group>;
}
function Geometry({node,selected}:{node:LayoutNode;selected:boolean}){
 const [w,h,d]=vector(node.size_xyz_mm);
 switch(node.kind){
  case "camera": return <group>
   <Block size={[w-.28,h,d-.19]} at={[-.14,0,-.095]} selected={selected} color="#55575c" radius={.065}/>
   <Block size={[.3,h-.02,d]} at={[(w-.3)/2,-.01,0]} selected={selected} color="#242527" radius={.065}/>
   <Cylinder radius={.323} length={.04} at={[0,0,d/2-.012]} color="#8e9197"/>
   <Block size={[.77,.46,.035]} at={[-.12,0,-d/2]} color="#13151a" radius={.035}/>
   <Block size={[.68,.37,.007]} at={[-.12,0,-d/2-.019]} color="#1b2832" radius={.012}/>
   <Cylinder radius={.09} length={.035} axis="y" at={[.36,h/2-.01,-.07]} color="#252629"/>
   <Cylinder radius={.047} length={.02} axis="y" at={[.44,h/2+.008,.18]} color="#b73131"/>
   <Block size={[.23,.018,.23]} at={[-.01,h/2-.006,-.03]} color="#15171c"/>
   {Array.from({length:7},(_,i)=><Block key={i} size={[.33,.022,.008]} at={[-.38,.22-i*.05,-d/2-.006]} color="#111215" radius={.005}/>)}
   {[-.45,-.19,.07].map(x=><Cylinder key={x} radius={.028} length={.014} axis="y" at={[x,h/2,.22]} color="#252629"/>)}
   <Block size={[.016,.43,.28]} at={[-w/2-.001,-.018,.05]} color="#26272b" radius={.01}/>
  </group>;
  case "lens":return <group>
   <Cylinder radius={w/2-.024} length={d} color="#25272b"/>
   <Cylinder radius={w/2} length={.29} at={[0,0,-.19]} color="#111315"/>
   <Cylinder radius={w/2} length={.29} at={[0,0,.32]} color="#15171b"/>
   {[-.19,.32].flatMap(z=>Array.from({length:64},(_,i)=>{const a=i*Math.PI/32;return <group key={z+"-"+i} position={[Math.cos(a)*(w/2),Math.sin(a)*(w/2),z]} rotation={[0,0,a]}><Block size={[.008,.015,.27]} color="#36373a" radius={.002}/></group>}))}
   <Cylinder radius={.345} length={.01} at={[0,0,d/2]} color="#123646"/>
   <Cylinder radius={w/2} length={.025} at={[0,0,d/2-.015]} color="#3b3c3f"/>
   <Block size={[.02,.075,.09]} at={[-w/2,.09,.02]} color="#d26634" radius={.004}/>
   <Block size={[.025,.09,.13]} at={[-w/2,-.09,-.42]} color="#65676c"/>
   {selected&&<mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[w/2+.006,w/2+.006,d,40,1,true]}/><meshBasicMaterial wireframe color="#9cdad4" transparent opacity={.18}/></mesh>}
  </group>;
  case "cage":return <group>
   <Block size={[w,.07,.58]} at={[0,-h/2+.035,0]} selected={selected} color="#62656b" radius={.025}/>
   <Block size={[.085,h-.07,.34]} at={[-w/2+.043,0,.03]} selected={selected} color="#62656b" radius={.018}/>
   <Block size={[.06,h-.14,.055]} at={[w/2-.03,-.01,.2]} selected={selected} color="#62656b" radius={.012}/>
   <Block size={[.92,.055,.18]} at={[-.29,h/2-.03,.04]} selected={selected} color="#62656b" radius={.02}/>
   <Block size={[.075,.39,.32]} at={[-w/2-.008,.02,.04]} color="#404349" radius={.014}/>
   <Bolt at={[-w/2-.015,.19,.23]}/>
   {[-.45,-.2,.05].map(x=><Cylinder key={x} radius={.029} length={.011} axis="y" at={[x,h/2,.055]} color="#121518"/>)}
   <Block size={[.57,.055,.53]} at={[.04,-h/2-.02,-.02]} color="#383b40" radius={.008}/>
   {node.mounting_points?.map(point=>{const [sw,sh,sd]=vector(point.size_xyz_mm);return <group key={point.id} position={vector(point.local_position_mm)} rotation={point.rotation_deg.map(v=>v*Math.PI/180) as Vec3}>
    <Block size={[sw,sh/2,sd]} at={[0,-sh/4,0]} selected={selected} color="#62656b" radius={.005}/>
    {[-1,1].map(s=><Block key={s} size={[sw*.14,sh/2,sd]} at={[s*sw*.43,sh/4,0]} color="#85898f" radius={.004}/>)}
   </group>})}
  </group>;
  case "audioReceiver":return <group>
   <Block size={[w,h-.032,d]} at={[0,.016,0]} selected={selected} color="#171d23" radius={.025}/>
   <Block size={[.22,.032,.16]} at={[0,-h/2+.016,0]} color="#666e78" radius={.005}/>
   <Block size={[w*.62,.008,d*.64]} at={[-w*.12,h/2,d*.02]} color="#162f37" radius={.012}/>
   <Cylinder radius={.058} length={.018} axis="y" at={[w*.33,h/2-.009,0]} color="#555f6b"/>
   <Cylinder radius={.041} length={.019} axis="y" at={[w*.33,h/2-.008,0]} color="#1b2026"/>
   {[-.07,.045].map(z=><Cylinder key={z} radius={.018} length={.007} axis="x" at={[-w/2,0,z]} color="#080c11"/>)}
   {[-.16,-.11].map(x=><Block key={x} size={[.018,.009,.06]} at={[x,h/2+.001,.02]} color="#8bbb98" radius={.003}/>)}
  </group>;
  case "baseplate":return <group><RodClamp w={w} h={h} d={d} selected={selected}/>{[-.24,.24].map(x=><Block key={x} size={[.2,.015,.64]} at={[x,h/2+.007,0]} color="#191a1c" radius={.008}/>)}</group>;
  case "rods":return <group>{[-.3,.3].map(x=><Cylinder key={x} radius={.075} length={d} at={[x,0,0]} color={selected?"#638d8f":"#25282c"}/>)}</group>;
  case "matte":return <group>
   {[-1,1].map(s=><group key={s}><Block size={[w,.11,d]} at={[0,s*(h/2-.055),0]} selected={selected} color="#313439"/><Block size={[.115,h-.16,d]} at={[s*(w/2-.058),0,0]} selected={selected} color="#313439"/></group>)}
   <group position={[0,h/2-.015,0]} rotation={[-.24,0,0]}><Block size={[w,.018,.69]} at={[0,0,.18]} color="#26282c" radius={.004}/></group>
   <mesh position={[0,0,-d/2-.03]}><torusGeometry args={[.445,.026,16,64]}/><meshStandardMaterial color="#3a3d41" metalness={.8} roughness={.4}/></mesh>
   <Block size={[.07,.2,.24]} at={[w/2+.03,.22,0]} color="#35383c"/>
  </group>;
  case "batteryPlate":return <group>
   <Block size={[w,h-.22,d]} at={[0,-.11,0]} selected={selected} color="#35373b" radius={.045}/>
   <RodClamp w={.9} h={.22} d={.32} at={[0,h/2-.11,0]} selected={selected}/>
   <Block size={[.36,.41,.05]} at={[0,.12,-d/2-.023]} color="#15171a" radius={.01}/>
   {Array.from({length:10},(_,i)=><Block key={i} size={[.02,.47,.008]} at={[-.42+i*.035,.48,-d/2-.007]} color="#121519" radius={.005}/>)}
   {[-.32,0,.32].map(x=><Bolt key={x} at={[x,-.58,d/2+.008]}/>)}
   <Cylinder radius={.08} length={.06} axis="x" at={[-w/2-.02,.15,0]} color="#252629"/>
  </group>;
  case "battery":return <group>
   <Block size={[w,h,d]} selected={selected} color="#222428" radius={.065}/>
   <Block size={[w-.04,h-.05,.015]} at={[0,0,-d/2-.001]} color="#101319" radius={.07}/>
   <Block size={[.31,.23,.008]} at={[-.01,.27,-d/2-.012]} color="#182e35" radius={.02}/>
   <mesh position={[-.01,.27,-d/2-.018]}><ringGeometry args={[.065,.07,32]}/><meshBasicMaterial color="#87cbbf" side={2}/></mesh>
   <Block size={[.18,.025,.03]} at={[.14,h/2,0]} color="#151719"/>
  </group>;
  case "gimbal":return <group>
   <Cylinder radius={.31} length={.29} axis="y" color="#3a3d41"/>
   <Block size={[.66,.57,.65]} at={[0,-.37,0]} selected={selected} color="#24272c" radius={.07}/>
   <Block size={[.37,.34,.012]} at={[0,-.3,-.334]} color="#101e29" radius={.025}/>
   <Cylinder radius={.055} length={.025} at={[-.14,-.6,-.34]} color="#757a80"/>
   <Block size={[.17,.16,1.28]} at={[0,.1,-.48]} color="#30343b"/>
   <Cylinder radius={.27} length={.3} at={[0,.35,-1.12]} color="#373b41"/>
   <group position={[.45,.74,-1.13]} rotation={[0,0,-.6]}><Block size={[1.17,.16,.19]} color="#343840"/></group>
   <Block size={[.16,.78,.19]} at={[.96,1.06,-1.13]} color="#33373e"/>
   <Block size={[.17,.17,1.24]} at={[.96,1.57,-.6]} color="#33373e"/>
   <Block size={[.025,.03,.91]} at={[.87,1.6,-.67]} color="#a92c33" radius={.005}/>
   <Cylinder radius={.25} length={.27} axis="x" at={[.96,1.57,.06]} color="#35393f"/>
   <Cylinder radius={.16} length={.014} axis="x" at={[1.104,1.57,.06]} color="#23262c"/>
   <Block size={[.53,.13,.17]} at={[.65,1.25,.06]} color="#353a42"/>
   <Block size={[.14,.78,.18]} at={[.41,.91,.06]} color="#353a42"/>
   <Block size={[.59,.07,.74]} at={[.17,.735,.06]} color="#62666d"/>
  </group>;
  case "grip":return <group>
   <Block size={[w,h,d]} selected={selected} color="#1b1d21" radius={.085}/>
   <Block size={[w*.77,h*.79,.01]} at={[-w*.07,0,-d/2-.002]} color="#24272b" radius={.04}/>
   <Block size={[w-.05,.12,d-.06]} at={[0,-h/2+.08,0]} color="#3e4248"/>
  </group>;
  case "monitorMount":return <group>
   <Block size={[.25,.36,.33]} at={[w/2-.125,0,0]} selected={selected} color="#393e45"/>
   <Cylinder radius={.095} length={.07} axis="y" at={[w/2-.125,-.18,0]} color="#9b9fa5"/>
   <Block size={[w-.35,.08,.2]} at={[-.055,.035,0]} selected={selected} color="#42464d"/>
   <Block size={[w-.4,.015,.025]} at={[-.06,.048,-.12]} color="#a73232" radius={.003}/>
   <Cylinder radius={.13} length={.22} axis="x" at={[-w/2+.16,-.08,0]} color="#41464e"/>
   <Block size={[.24,.08,.25]} at={[-w/2+.15,-.15,0]} color="#3d4147"/>
   <Cylinder radius={.073} length={.035} axis="y" at={[-w/2+.15,-.2,0]} color="#a4a7ab"/>
  </group>;
  case "monitor":return <group>
   <Block size={[w,h,d]} selected={selected} color="#292c31" radius={.045}/>
   <Block size={[w-.13,h-.13,.016]} at={[0,.01,-d/2-.005]} color="#07111b" radius={.025}/>
   <Block size={[w-.2,h-.21,.008]} at={[0,.018,-d/2-.017]} color="#193745" radius={.008}/>
   <Block size={[1.15,.025,.01]} at={[0,-.38,-d/2-.023]} color="#769496" radius={.003}/>
   {[-.47,.47].map(x=><Block key={x} size={[.055,.85,.06]} at={[x,.05,d/2+.01]} color="#16191e"/>)}
   <Block size={[.97,.7,.055]} at={[0,.18,d/2+.013]} color="#191c22"/>
   {Array.from({length:5},(_,i)=><Block key={i} size={[.018,.7,.009]} at={[-.8+i*.04,.19,d/2+.011]} color="#13151a"/>)}
   <Block size={[.35,.09,.012]} at={[.48,-.49,d/2+.015]} color="#15181c"/>
  </group>;
  case "handle":return <group>
   <Block size={[.58,.35,.46]} at={[0,.22,.45]} selected={selected} color="#2c3036" radius={.04}/>
   <Block size={[.3,.18,1.2]} at={[0,.15,-.14]} selected={selected} color="#262a2f" radius={.055}/>
   <Block size={[.12,.58,.14]} at={[0,-.1,-.47]} color="#41464f"/>
   <Block size={[.24,.08,.32]} at={[0,-.4,-.37]} color="#42464e"/>
   {[-.16,.02,.2].map(x=><Cylinder key={x} radius={.045} length={.017} at={[x,.26,.69]} color="#858b92"/>)}
  </group>;
 }
}

function AnimatedNode({ node, exploded, vertical, selected, onSelect, context, reveal }: {
  node: LayoutNode; exploded: boolean; vertical: boolean; selected: boolean; onSelect: (id: string) => void; context:boolean; reveal:boolean;
}) {
  const group = useRef<Group>(null);
  const pose = nodePose(node,vertical,exploded);
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
    if(!context)return;
    const restore:(()=>void)[]=[];
    group.current?.traverse(object=>{if(object instanceof Mesh){for(const material of Array.isArray(object.material)?object.material:[object.material]){const opacity=material.opacity,transparent=material.transparent,depthWrite=material.depthWrite;material.opacity=opacity*.18;material.transparent=true;material.depthWrite=false;restore.push(()=>{material.opacity=opacity;material.transparent=transparent;material.depthWrite=depthWrite;});}}});
    return ()=>restore.forEach(reset=>reset());
  },[context,selected]);
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(node.id); };
  const rotation = pose.rotation_deg.map(v=>v*Math.PI/180) as Vec3;
  return <group ref={group} position={pos} scale={initialScale.current} onClick={click}>
    <group rotation={rotation}>
      <Geometry node={node} selected={selected} />
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
function CameraControls({ angle, exploded, handheld, resetKey, onInteract }: { angle: ViewAngle; exploded: boolean; handheld: boolean; resetKey: number; onInteract?: () => void }) {
  const { camera, invalidate } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  useEffect(() => {
    const center = new Vector3(-0.25, handheld ? 0.1 : -1.1, 0);
    const distance = exploded ? 1.25 : 1;
    const positions: Record<ViewAngle, Vec3> = handheld
      ? { iso: [-4, 2.1, -5], side: [-6, 1.1, 0.2], front: [0, 0.8, 6] }
      : { iso: [-6, 2.2, -7.5], side: [-9, 1.6, 0.2], front: [0, 1.1, 10] };
    camera.position.set(...positions[angle]).multiplyScalar(distance);
    camera.lookAt(center);
    if (controls.current) { controls.current.target.copy(center); controls.current.update(); }
    invalidate();
  }, [angle, camera, exploded, handheld, resetKey, invalidate]);
  return <OrbitControls ref={controls} onStart={onInteract} minDistance={3} maxDistance={18} maxPolarAngle={Math.PI * 0.9} enableDamping dampingFactor={0.08} />;
}
function SceneReady({ sceneKey, onReady }: { sceneKey?: string; onReady?: () => void }) {
  const invalidate = useThree(state => state.invalidate);
  const frames = useRef(0);
  const callback = useRef(onReady);
  callback.current = onReady;
  useEffect(() => { frames.current = 0; invalidate(); }, [sceneKey, invalidate]);
  useFrame(() => {
    if (frames.current >= 2) return;
    frames.current += 1;
    if (frames.current === 2) callback.current?.();
    else invalidate();
  });
  return null;
}
class ViewerBoundary extends Component<{ children: ReactNode; onUnavailable?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable?.(); }
  render() {
    return this.state.failed ? <div className="viewer-fallback">El navegador no pudo iniciar WebGL. El manifiesto, las conexiones y el inspector siguen disponibles.</div> : this.props.children;
  }
}
function PortProjection({anchors,elements}:{anchors:{id:string;position:Vec3}[];elements:React.RefObject<Record<string,HTMLSpanElement|null>>}){
 const point=new Vector3();
 useFrame(({camera,size})=>anchors.forEach(a=>{const el=elements.current[a.id];if(!el)return;point.set(...a.position).project(camera);el.style.transform=`translate(-50%,-50%) translate(${(point.x*.5+.5)*size.width}px,${(-point.y*.5+.5)*size.height}px)`;el.style.visibility=point.z>1||point.z< -1?"hidden":"visible";}));
 return null;
}
export default function RigViewer({exploded,showCables,showLabels,variant,selectedId,onSelect,angle,selectedCableId,resetKey,highlightIds=[],contextIds=[],reveal=false,framing,sceneKey,onSceneReady,onUnavailable,onInteract,performanceRun,onPerformanceResult}:Props){
 const labels=useRef<Record<string,HTMLButtonElement|null>>({});const portLabels=useRef<Record<string,HTMLSpanElement|null>>({});
 const nodes=layoutData.nodes.filter(n=>variant.active_part_ids.includes(n.id));
 const vertical=variant.viewer.mode==="vertical";
 const handheld=framing?framing==="handheld":!variant.active_part_ids.includes("dji-rs4-pro-combo");
 const positions=Object.fromEntries(nodes.map(n=>[n.id,vector(nodePose(n,vertical,exploded).position_mm)]));
 const endpoint=(portId:string):Vec3|null=>{
   const port=portById[portId]; const node=nodes.find(n=>n.id===port?.part_id);
   if(!node||!port.local_position_mm)return null;
   const r=nodePose(node,vertical,exploded).rotation_deg.map(v=>v*Math.PI/180) as Vec3;
   const p=new Vector3(...vector(port.local_position_mm)).applyEuler(new Euler(...r)).add(new Vector3(...positions[node.id]));
   return [p.x,p.y,p.z];
 };
 const links=variant.cable_profile_ids.map(id=>({cable:cableById[id],a:endpoint(cableById[id].from_port_id),b:endpoint(cableById[id].to_port_id)})).filter(l=>l.a&&l.b&&l.cable.display_kind==="cable");
 const focus=links.find(l=>l.cable.cable_id===selectedCableId);
 const visibleIds=visibleCableIds(links.map(link=>link.cable.cable_id),showCables,selectedCableId);
 const visibleLinks=links.filter(link=>visibleIds.includes(link.cable.cable_id));
 const anchors=focus?[{id:"a",position:focus.a!},{id:"b",position:focus.b!}]:[];
 const route=cableById[selectedCableId??""];
 return <div className="rig-stage" aria-label="Visor 3D del rig, geometría aproximada" data-visible-parts={nodes.map(n=>n.id).join(",")} data-visible-cables={visibleIds.join(",")} data-context-parts={contextIds.join(",")}>
  <div className="stage-corner">MODELO DE PLANIFICACIÓN <span>Geometría aproximada</span></div>
  <ViewerBoundary onUnavailable={onUnavailable}><Suspense fallback={<div className="viewer-fallback">Iniciando visor...</div>}><Canvas frameloop={performanceRun?.policy??"demand"} camera={{position:[-6,2.2,-7.5],fov:36}} dpr={[1,1.5]} gl={{antialias:true,alpha:true}}>
   <ambientLight intensity={1.6}/><directionalLight position={[-3,7,-6]} intensity={4.5} color="#f1f2ff"/><directionalLight position={[5,3,5]} intensity={3} color="#aec3d8"/><pointLight position={[-3,-2,-3]} intensity={14} color="#7cacae"/>
   <gridHelper args={[20,40,"#3d434c","#242933"]} position={[0,handheld?-.8:-3.6,0]}/>
   {nodes.map(n=><AnimatedNode key={n.id} node={n} exploded={exploded} vertical={variant.viewer.mode==="vertical"} selected={(selectedId===n.id&&!selectedCableId)||highlightIds.includes(n.id)} onSelect={onSelect} context={contextIds.includes(n.id)} reveal={reveal}/>)}
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
   <CameraControls angle={angle} exploded={exploded} handheld={handheld} resetKey={resetKey} onInteract={onInteract}/><LabelProjector nodes={nodes} exploded={exploded} vertical={vertical} elements={labels}/><PortProjection anchors={anchors} elements={portLabels}/><SceneReady sceneKey={sceneKey} onReady={onSceneReady}/>
   {performanceRun&&onPerformanceResult&&<PerformanceProbe key={performanceRun.id} run={performanceRun} onResult={onPerformanceResult}/>}
  </Canvas></Suspense></ViewerBoundary>
  <div className="label-layer">{nodes.filter(n=>showLabels&&primaryLabels.has(n.id)||(!selectedCableId&&n.id===selectedId)).map(n=><button key={n.id} ref={el=>{labels.current[n.id]=el}} className={n.id===selectedId?"part-label selected":"part-label"} onClick={()=>onSelect(n.id)}>{n.label}</button>)}
   {focus&&anchors.map((a,i)=><span key={a.id} ref={el=>{portLabels.current[a.id]=el}} className="port-marker"><b>{i?"B":"A"}</b>{portById[i?focus.cable.to_port_id:focus.cable.from_port_id].label}</span>)}
  </div>
  {selectedCableId&&<div className="route-hud" style={{"--route-color":route?cablesData.color_coding[route.type==="data"?"control":route.type]:undefined} as React.CSSProperties}><span className="eyebrow">{focus?"RECORRIDO RESALTADO":route?.display_kind==="contacts"?"CONTACTOS / SIN CABLE":route?.display_kind==="internal"?"ALIMENTACIÓN INTERNA":"CONEXIÓN SIN GEOMETRÍA VALIDADA"}</span><strong>{connectionName(selectedCableId)}</strong><p>{exploded?"En despiece: vínculo lógico, cable desconectado.":"Anclajes y bucles aproximados. No valida radios ni despejes."}</p></div>}
  <div className="stage-footer"><span>ARRASTRA PARA GIRAR / ACERCA O ALEJA</span><span>Forma reconstruida con fotos y cotas, no CAD</span></div>
 </div>;
}
