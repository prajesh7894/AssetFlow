import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary/10 text-primary hover:bg-primary/20": variant === "default",
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20": variant === "destructive",
          "text-foreground": variant === "outline",
          "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20": variant === "success",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
