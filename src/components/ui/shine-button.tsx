import * as React from "react";
import { cn } from "@/lib/utils";

interface ShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  size?: "default" | "lg" | "xl";
}

const ShineButton = React.forwardRef<HTMLButtonElement, ShineButtonProps>(
  ({ className, children, icon, loading, size = "default", disabled, ...props }, ref) => {
    const sizeClasses = {
      default: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-lg",
      xl: "h-16 px-10 text-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "group relative overflow-hidden rounded-xl font-display font-bold",
          "bg-gradient-to-r from-primary via-cyan-400 to-primary bg-[length:200%_100%]",
          "text-primary-foreground",
          "transition-all duration-500 ease-out",
          "hover:bg-[position:100%_0] hover:shadow-[0_0_40px_hsl(187_100%_50%_/_0.4)]",
          "active:scale-[0.98]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
          "shadow-[0_0_20px_hsl(187_100%_50%_/_0.3)]",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Shine effect overlay */}
        <span
          className={cn(
            "absolute inset-0 translate-x-[-100%]",
            "bg-gradient-to-r from-transparent via-white/30 to-transparent",
            "group-hover:translate-x-[100%] transition-transform duration-700 ease-out",
            "skew-x-[-20deg]"
          )}
        />
        
        {/* Button content */}
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : icon ? (
            <span className="w-5 h-5">{icon}</span>
          ) : null}
          {children}
        </span>
      </button>
    );
  }
);

ShineButton.displayName = "ShineButton";

export { ShineButton };
