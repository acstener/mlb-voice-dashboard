import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export type SidebarState = "expanded" | "collapsed"

export type SidebarContext = {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export const SidebarContext = React.createContext<SidebarContext | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side={side}
            className={cn(
              "w-[280px] p-0 bg-gradient-to-b from-mlb-navy to-mlb-navy/95 text-white border-r border-white/10",
              className
            )}
          >
            {children}
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "hidden md:block bg-gradient-to-b from-mlb-navy to-mlb-navy/95 text-white border-r border-white/10",
          "w-[280px] h-screen transition-all duration-300 ease-in-out",
          className
        )}
        data-state={state}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"