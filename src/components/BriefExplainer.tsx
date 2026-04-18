import { Sparkles } from 'lucide-react';

type Props = {
  className?: string;
};

/**
 * Shared explainer for all /hire flows: brief → AI matchmaker → professional fit.
 */
export default function BriefExplainer({ className = '' }: Props) {
  return (
    <aside
      className={`rounded-sk-lg border border-sk-purple/20 bg-sk-purple-light/10 p-4 sm:p-5 ${className}`.trim()}
      aria-labelledby="sk-brief-explainer-heading"
    >
      <div className="flex gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sk-md bg-sk-purple text-white"
          aria-hidden
        >
          <Sparkles className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h2 id="sk-brief-explainer-heading" className="m-0 text-sm font-bold text-sk-navy sm:text-base">
            3 Minutes to a Professional Brief
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-sk-text-muted sm:text-sm">
            How we use your data to match you with the perfect professional.
          </p>
        </div>
      </div>
    </aside>
  );
}
