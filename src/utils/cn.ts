import { twMerge } from "tailwind-merge";
import { ClassArray, clsx } from "clsx";

export default function cn(...inputs: ClassArray) {
  return twMerge(clsx(...inputs))
}