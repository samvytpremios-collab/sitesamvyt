import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  selected?: boolean;
  popular?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ selected, popular, onClick, children, className, delay = 0 }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.4 }}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          "relative cursor-pointer rounded-2xl p-[2px] transition-all duration-300",
          selected
            ? "bg-gradient-to-br from-primary via-cyan-400 to-blue-500"
            : "bg-border hover:bg-gradient-to-br hover:from-primary/50 hover:via-cyan-400/50 hover:to-blue-500/50",
          className
        )}
      >
        {/* Popular badge */}
        {popular && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute -top-3 left-1/2 -translate-x-1/2 z-10",
              "px-4 py-1.5 rounded-full text-xs font-bold font-display",
              "bg-gradient-to-r from-amber-400 to-orange-500 text-primary-foreground",
              "shadow-[0_0_20px_hsl(38_90%_50%_/_0.4)]"
            )}
          >
            ⭐ POPULAR
          </motion.span>
        )}

        {/* Inner card content */}
        <div
          className={cn(
            "relative rounded-[14px] p-6 h-full",
            "bg-card/95 backdrop-blur-sm",
            selected && "shadow-[inset_0_0_20px_hsl(187_100%_50%_/_0.1)]"
          )}
        >
          {/* Glow effect when selected */}
          {selected && (
            <div className="absolute inset-0 rounded-[14px] bg-primary/5 animate-pulse" />
          )}
          
          <div className="relative z-10">{children}</div>
        </div>
      </motion.div>
    );
  }
);

GlowCard.displayName = "GlowCard";

export { GlowCard };
