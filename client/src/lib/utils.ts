import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatSocialNumber = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const absValue = Math.abs(value);

  const format = (num: number, suffix: string) => {
    const formatted =
      num % 1 === 0 ? num.toFixed(0) : num.toFixed(1).replace(/\.0$/, "");

    return `${formatted}${suffix}`;
  };

  if (absValue < 1000) {
    return value.toString();
  }

  if (absValue < 1_000_000) {
    return format(value / 1_000, "K");
  }

  if (absValue < 1_000_000_000) {
    return format(value / 1_000_000, "M");
  }

  if (absValue < 1_000_000_000_000) {
    return format(value / 1_000_000_000, "B");
  }

  return format(value / 1_000_000_000_000, "T");
};
