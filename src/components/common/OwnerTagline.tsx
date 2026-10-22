import React from 'react';

interface OwnerTaglineProps {
  /** Owner's short navigation label, e.g. "CHARTS" */
  label: string;
  /** Owner's CTC phrase paired with the label, e.g. "Climbing the Charts" */
  phrase: string;
  className?: string;
}

/**
 * Owner-supplied navigation label + CTC phrase kicker.
 * Joshua's copy (Oct 22, 2026) — his exact words, layered onto each
 * destination's header in the app's existing kicker-chip style.
 */
export const OwnerTagline: React.FC<OwnerTaglineProps> = ({ label, phrase, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="engraved-plate-gold text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
        {label}
      </span>
      <span className="text-[11px] font-black tracking-wide uppercase text-amber-300">
        {phrase}
      </span>
    </div>
  );
};
