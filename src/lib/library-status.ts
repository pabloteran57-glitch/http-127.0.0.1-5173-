export interface LibrarySnapshot {current:string|null;previous:string|null;legacy:string|null}
export function libraryChanged(storage:Pick<Storage,"getItem">,snapshot:LibrarySnapshot,keys:{current:string;previous:string;legacy:string}):boolean {
  return storage.getItem(keys.current)!==snapshot.current||storage.getItem(keys.previous)!==snapshot.previous||storage.getItem(keys.legacy)!==snapshot.legacy;
}
export function sameLibrarySnapshot(a:LibrarySnapshot,b:LibrarySnapshot):boolean {
  return a.current===b.current&&a.previous===b.previous&&a.legacy===b.legacy;
}
