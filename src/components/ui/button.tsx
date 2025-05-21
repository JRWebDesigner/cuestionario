import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
