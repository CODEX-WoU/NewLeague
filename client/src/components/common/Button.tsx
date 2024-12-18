import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className="w-full btn bg-primary hover:bg-primary/90 text-white border-none"
    >
      {children}
    </button>
  );
};
