import type { Cable, LayoutManifest, LayoutNode, MonitorJoint, Part, Variant, Vec3 } from "./types";

type Matrix3 = [number,number,number,number,number,number,number,number,number];
export function rotationMatrix(rotation:Vec3):Matrix3 {
  const [x,y,z]=rotation.map(v=>v*Math.PI/180),a=Math.cos(x),b=Math.sin(x),c=Math.cos(y),d=Math.sin(y),e=Math.cos(z),f=Math.sin(z);
  return [c*e,-c*f,d,b*d*e+a*f,-b*d*f+a*e,-b*c,-a*d*e+b*f,a*d*f+b*e,a*c];
}
export function rotateVector(matrix:Matrix3,point:Vec3):Vec3 {
  return [0,1,2].map(row=>matrix[row*3]*point[0]+matrix[row*3+1]*point[1]+matrix[row*3+2]*point[2]) as Vec3;
}
function multiply(a:Matrix3,b:Matrix3):Matrix3 {
  return Array.from({length:9},(_,i)=>[0,1,2].reduce((sum,k)=>sum+a[Math.floor(i/3)*3+k]*b[k*3+i%3],0)) as Matrix3;
}
function matrixEuler(m:Matrix3):Vec3 {
  const y=Math.asin(Math.max(-1,Math.min(1,m[2]))),regular=Math.abs(m[2])<.9999999;
  return [(regular?Math.atan2(-m[5],m[8]):Math.atan2(m[7],m[4]))*180/Math.PI,y*180/Math.PI,(regular?Math.atan2(-m[1],m[0]):0)*180/Math.PI];
}
export interface JointTransform {pivot_mm:Vec3;rotation_deg:Vec3}
export function jointPoint(point:Vec3,transforms:JointTransform[]):Vec3 {
  return transforms.reduce((p,t)=>rotateVector(rotationMatrix(t.rotation_deg),p.map((v,i)=>v-t.pivot_mm[i]) as Vec3).map((v,i)=>v+t.pivot_mm[i]) as Vec3,[...point] as Vec3);
}
export function monitorJoint(variant:Variant,layout:LayoutManifest):MonitorJoint|null {
  const joint=layout.monitor_joints?.[monitorRoute(variant)??""];
  return joint&&[joint.mount_id,joint.monitor_id].every(id=>variant.active_part_ids.includes(id))?joint:null;
}
export function monitorPose(variant:Variant,layout:LayoutManifest) {
  const joint=monitorJoint(variant,layout),pose=variant.viewer.adjustments?.monitor;
  const clamp=(value:number|undefined,range:[number,number])=>Number.isFinite(value)?Math.max(range[0],Math.min(range[1],value!)):0;
  return {tilt_deg:joint&&pose?.mount_id===joint.mount_id?clamp(pose.tilt_deg,joint.tilt_range_deg):0,swivel_deg:joint&&pose?.mount_id===joint.mount_id?clamp(pose.swivel_deg,joint.swivel_range_deg):0};
}
export function monitorTransforms(variant:Variant,layout:LayoutManifest):JointTransform[] {
  const joint=monitorJoint(variant,layout),pose=monitorPose(variant,layout);
  return joint?[{pivot_mm:joint.tilt_pivot_local_mm,rotation_deg:[pose.tilt_deg,0,0]},{pivot_mm:joint.swivel_pivot_local_mm,rotation_deg:[0,pose.swivel_deg,0]}]:[];
}

export function monitorRoute(variant:Variant) {
  return variant.viewer.monitor_mount_route;
}

export function cableForVariant(cable:Cable,variant:Variant):Cable {
  const route=monitorRoute(variant);
  return {...cable,...(route?cable.monitor_route_overrides?.[route]:undefined)};
}

export function layoutForVariant(variant:Variant,layout:LayoutManifest):LayoutManifest {
  const route=monitorRoute(variant);
  const overrides=(route?layout.monitor_mount_routes?.[route]?.overrides:undefined)??{};
  const nodes=layout.nodes.map(node=>({...node,...overrides[node.id]}));
  const joint=monitorJoint(variant,layout),transforms=monitorTransforms(variant,layout);
  const mount=nodes.find(node=>node.id===joint?.mount_id);
  const pose=monitorPose(variant,layout);
  if(joint&&mount&&(pose.tilt_deg!==0||pose.swivel_deg!==0)){
    const mountMatrix=rotationMatrix(mount.rotation_deg),inverse=rotationMatrix([0,0,0]);
    for(let row=0;row<3;row++)for(let col=0;col<3;col++)inverse[row*3+col]=mountMatrix[col*3+row];
    for(const node of nodes.filter(n=>[joint.monitor_id,...joint.attached_part_ids].includes(n.id))){
      const local=rotateVector(inverse,node.position_mm.map((v,i)=>v-mount.position_mm[i]) as Vec3);
      node.position_mm=rotateVector(mountMatrix,jointPoint(local,transforms)).map((v,i)=>v+mount.position_mm[i]) as Vec3;
      let rotation=multiply(inverse,rotationMatrix(node.rotation_deg));
      for(const transform of transforms)rotation=multiply(rotationMatrix(transform.rotation_deg),rotation);
      node.rotation_deg=matrixEuler(multiply(mountMatrix,rotation));
    }
  }
  const slide=variant.viewer.adjustments?.battery_plate;
  const slideRule=layout.battery_plate_slide;
  if(slide&&slideRule&&[slideRule.plate_id,slideRule.rod_id].every(id=>variant.active_part_ids.includes(id))){
    const rods=nodes.find(n=>n.id===slideRule.rod_id);
    if(rods){
      const offset=Math.max(-slide.measured_back_mm,Math.min(slide.measured_forward_mm,slide.offset_mm));
      const vector=rotateVector(rotationMatrix(rods.rotation_deg),slideRule.rod_axis_local.map(v=>v*offset) as Vec3);
      for(const node of nodes.filter(n=>[slideRule.plate_id,...slideRule.attached_part_ids].includes(n.id)))node.position_mm=node.position_mm.map((v,i)=>v+vector[i]) as Vec3;
    }
  }
  return {...layout,nodes};
}

export function visibleCableIds(availableIds: string[], showAll: boolean, selectedId: string | null): string[] {
  return availableIds.filter(id => showAll || id === selectedId);
}

export function nodeWeight(node:LayoutNode,part:Part) {
  if(node.subcomponent_id){
    const component=part.subcomponents?.find(c=>c.id===node.subcomponent_id);
    return {value:component?.weight_g??null,approximate:false,published:!!component};
  }
  return {value:part.planning_weight_g,approximate:part.verified_weight_g.approximate,published:part.verified_weight_g.value!==null};
}

// Una pieza unida a la jaula gira con ella, incluidos los anclajes de cable.
export function nodePose(node:LayoutNode,vertical:boolean,exploded=false) {
  const position=node.position_mm.map((v,i)=>v+(exploded?node.explode_mm[i]:0)) as Vec3;
  const rotation=[...node.rotation_deg] as Vec3;
  if(vertical&&node.vertical_frame==="camera"){
    [position[0],position[1]]=[-position[1],position[0]];
    rotation[2]+=90;
  }
  return {position_mm:position,rotation_deg:rotation};
}

export function hiddenSubassemblies(node:LayoutNode,variant:Variant):string[] {
  return (node.visual_subassemblies??[]).filter(rule=>rule.hide_if_any_part_ids.some(id=>variant.active_part_ids.includes(id))).map(rule=>rule.object_name);
}

export function preferredPartId(ids:string[],layout:LayoutManifest):string {
  return ids.find(id=>layout.nodes.some(node=>node.id===id&&node.kind==="camera"))??ids[0]??"";
}

export function routeOffset(offset:Vec3,cameraFrame:boolean,vertical:boolean):Vec3 {
  return cameraFrame&&vertical?[-offset[1],offset[0],offset[2]]:[...offset];
}

export function cableRouteOffset(offset:Vec3,partId:string|null,variant:Variant,layout:LayoutManifest,cameraFrame:boolean):Vec3 {
  let result=routeOffset(offset,cameraFrame,variant.viewer.mode==="vertical");
  const joint=monitorJoint(variant,layout);
  if(!joint||!partId||![joint.monitor_id,...joint.attached_part_ids].includes(partId))return result;
  const route=monitorRoute(variant),mount=layout.nodes.find(n=>n.id===joint.mount_id);
  if(!mount)return result;
  const rotation=layout.monitor_mount_routes?.[route??""]?.overrides[mount.id]?.rotation_deg??mount.rotation_deg;
  const matrix=rotationMatrix(rotation),inverse=matrix.map((_,i)=>matrix[i%3*3+Math.floor(i/3)]) as Matrix3;
  result=rotateVector(inverse,result);
  for(const transform of monitorTransforms(variant,layout))result=rotateVector(rotationMatrix(transform.rotation_deg),result);
  return rotateVector(matrix,result);
}

// Sólo piezas móviles modeladas; no es una carga completa ni certificada.
export function movingMass(variant: Variant, layout: LayoutManifest, parts: Record<string, Part>) {
  const moving = layoutForVariant(variant,layout).nodes.filter(n => n.mass_domain === "moving" && variant.active_part_ids.includes(n.id));
  const subtotal=moving.reduce((sum,n)=>sum+(nodeWeight(n,parts[n.id]).value??0),0);
  return {
    subtotal,
    estimated: moving.filter(n=>!nodeWeight(n,parts[n.id]).published).map(n=>n.id),
    envelopeCentroid: subtotal ? [0,1,2].map(axis=>moving.reduce((sum,n)=>sum+(nodeWeight(n,parts[n.id]).value??0)*nodePose(n,variant.viewer.mode==="vertical").position_mm[axis],0)/subtotal) : null,
    unknown: moving.filter(n => nodeWeight(n,parts[n.id]).value === null).length,
    approximate: moving.some(n => nodeWeight(n,parts[n.id]).approximate),
    excluded: "Cables, fijaciones y adiciones de la pila pendientes de pesaje. TX y estuche fuera del rig; gimbal y monitor lateral fuera de carga móvil.",
  };
}
