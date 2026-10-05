import type { PropsWithChildren, ReactNode } from "react";

interface SectionProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: ReactNode;
  id?: string;
}

export default function Section({
  eyebrow,
  title,
  description,
  aside,
  children,
  id,
}: SectionProps) {
  return (
    <section id={id} className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="eyebrow text-xs text-signal">{eyebrow}</p>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              {title}
            </h2>
            {description ? (
              <p className="max-w-3xl text-sm leading-6 text-fog">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

