import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "./classnames";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: "neutral" | "good" | "warning" | "danger" | "info";
}

const toneClass = {
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  danger: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200"
};

export function Badge({ children, className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", toneClass[tone], className)}
      {...props}
    >
      {children}
    </span>
  );
}
