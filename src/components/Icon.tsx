import type { CSSProperties } from "react";

export type IconName = "design" | "connect" | "assemble" | "inventory" | "reset" | "settings" | "download" | "arrow" | "search" | "close" | "info" | "check" | "plus" | "play" | "pause";
const paths: Record<IconName, string> = {
  design: "M12 3 21 8v8l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v8",
  connect: "M6 3v6m12 6v6M3 9h6v3a3 3 0 0 1-6 0V9Zm12 3a3 3 0 0 1 6 0v3h-6v-3ZM6 15v2a3 3 0 0 0 3 3h1m8-11V7a3 3 0 0 0-3-3h-1",
  assemble: "M9 4h6v3H9V4Zm-2 2H5v15h14V6h-2M8 11l1 1 2-2m2 1h3M8 16l1 1 2-2m2 1h3",
  inventory: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
  reset: "M3 8V3m0 0h5M3 3l4 4M21 16v5m0 0h-5m5 0-4-4M16 3h5v5M8 21H3v-5",
  settings: "M3 6h18M3 12h18M3 18h18M7 3v6m10 0v6M9 15v6",
  download: "M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 6 6",
  close: "m6 6 12 12M6 18 18 6",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 11v6M12 7h.01",
  check: "m5 12 4 4L19 6",
  plus: "M12 4v16M4 12h16",
  play: "m8 4 12 8-12 8V4Z",
  pause: "M8 4v16M16 4v16"
};

export default function Icon({ name, className, style }: { name: IconName; className?: string; style?: CSSProperties }) {
  return <svg className={className} style={style} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}
