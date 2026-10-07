interface ViewerControlsProps {
  exploded: boolean;
  onExplodedChange: (value: boolean) => void;
  showLabels: boolean;
  onShowLabelsChange: (value: boolean) => void;
  showCables: boolean;
  onShowCablesChange: (value: boolean) => void;
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={value}
      onClick={() => onChange(!value)}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        value
          ? "border-signal bg-signal/10 text-white"
          : "border-white/10 bg-white/5 text-fog hover:border-white/25 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

export default function ViewerControls(props: ViewerControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Toggle
        label={props.exploded ? "Despiece" : "Ensamblado"}
        value={props.exploded}
        onChange={props.onExplodedChange}
      />
      <Toggle
        label={props.showLabels ? "Etiquetas visibles" : "Etiquetas ocultas"}
        value={props.showLabels}
        onChange={props.onShowLabelsChange}
      />
      <Toggle
        label={props.showCables ? "Cables visibles" : "Cables ocultos"}
        value={props.showCables}
        onChange={props.onShowCablesChange}
      />
    </div>
  );
}
