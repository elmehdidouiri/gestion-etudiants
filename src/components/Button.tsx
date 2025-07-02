import React from "react";

interface ButtonBaseProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

type ButtonProps =
  | (ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; href?: never })
  | (ButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string });

const base = "px-4 py-2 rounded font-medium focus:outline-none focus:ring transition disabled:opacity-50";
const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
};

const Button: React.FC<ButtonProps> = (props) => {
  const { children, variant = "primary", className = "" } = props;
  const v = variant || "primary";
  if (props.as === "a" && props.href) {
    const { as, variant, ...anchorProps } = props;
    return (
      <a {...anchorProps} className={`${base} ${variants[v]} ${className}`}>
        {children}
      </a>
    );
  }
  const { as, href, variant: v2, ...buttonProps } = props as any;
  return (
    <button {...buttonProps} className={`${base} ${variants[v]} ${className}`}>
      {children}
    </button>
  );
};

export default Button; 