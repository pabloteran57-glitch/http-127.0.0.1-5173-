import type { AssemblyContentBlock, AssemblyProfileContent, Cable, PlannerRules, Variant } from "./types";

export function assemblyTimeline(variant: Variant, rules: PlannerRules, cables: Cable[], content: AssemblyProfileContent) {
  const active = new Set(variant.active_part_ids);
  const circuits = new Set(variant.cable_profile_ids);
  if (!rules.camera_part_ids.some(id => active.has(id))) return [];
  const profile=rules.assembly_profiles?.find(profile=>active.has(profile.camera_part_id));
  const steps=profile?content.profiles?.find(item=>item.id===profile.id)?.steps:content.steps;
  const frames=profile?.frames??rules.assembly_frames;
  if(!steps)return [];
  const applies = (block: AssemblyContentBlock) => block.part_ids.some(id => active.has(id))
    && (block.require_all ?? []).every(id => active.has(id))
    && !(block.unless_any ?? []).some(id => active.has(id))
    && (block.cable_ids ?? []).every(id => circuits.has(id));
  return steps.flatMap(step => {
    const frame = frames.find(frame=>frame.step===step.number);
    if(!frame)return [];
    const blocks = step.blocks.filter(applies);
    const hasParts = frame.add_part_ids.some(id => active.has(id));
    const hasCables = frame.add_cable_ids.some(id => circuits.has(id) && cables.some(c => c.cable_id === id));
    const relevant = step.requires_any.length ? step.requires_any.some(id => active.has(id)) : true;
    if (!relevant || !blocks.length || (step.kind === "mount" && !hasParts && !hasCables)) return [];
    return [{...step, source_ids: [...new Set([...(step.source_ids ?? []), ...blocks.flatMap(block => block.source_ids ?? [])])], blocks, part_ids: [...new Set(blocks.flatMap(block => block.part_ids.filter(id => active.has(id))))], cable_ids: frame.add_cable_ids.filter(id => circuits.has(id)), playable: step.kind !== "optional"}];
  });
}

export function nextPlaybackIndex(timeline: {playable: boolean}[], index: number) {
  return timeline.findIndex((step, i) => i > index && step.playable);
}
