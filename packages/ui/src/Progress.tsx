import { cx } from "./classnames";

export interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cx("h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800", className)}>
      <div className="h-full rounded-full bg-sky-500" style={{ width: `${clamped}%` }} />
    </div>
  );
}
