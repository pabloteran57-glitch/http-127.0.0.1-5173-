import clsx from "clsx";
import { variantsData } from "../data";

interface VariantSelectorProps {
  activeId: string;
  onChange: (id: string) => void;
}

export default function VariantSelector({
  activeId,
  onChange,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {variantsData.variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          aria-pressed={activeId === variant.id}
          onClick={() => onChange(variant.id)}
          className={clsx(
            "rounded-full border px-4 py-2 text-sm transition",
            activeId === variant.id
              ? "border-signal bg-signal/10 text-white"
              : "border-white/10 bg-white/5 text-fog hover:border-white/25 hover:text-white",
          )}
        >
          {variant.label}
        </button>
      ))}
    </div>
  );
}
