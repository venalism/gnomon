import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "./classnames";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

const variantClass = {
  primary: "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950",
  secondary:
    "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
  ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-500"
};

const sizeClass = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm"
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
