import { CircleDot, CalendarDays, MessageSquare, Settings } from "lucide-react"
import { Sidebar } from "@/components/ui/sidebar/SidebarBase"
import { cn } from "@/lib/utils"

const items = [
  {
    title: "Games",
    url: "/",
    icon: CircleDot,
  },
  {
    title: "Schedule",
    url: "#",
    icon: CalendarDays,
  },
  {
    title: "Chat",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <div className="flex flex-col h-full p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            🧠 MLB Brain
          </h2>
          <p className="text-sm text-white/60">Your smart baseball companion</p>
        </div>

        <nav className="mt-10 flex-1">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.title}>
                <a
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg",
                    "text-white/80 hover:text-white",
                    "transition-all duration-200",
                    "hover:bg-white/10 active:bg-white/15",
                    "group"
                  )}
                >
                  <item.icon className="w-5 h-5 text-mlb-red group-hover:text-white transition-colors" />
                  <span className="font-medium">{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-mlb-red/20 flex items-center justify-center">
              <span className="text-sm font-medium text-mlb-red">AI</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                MLB Assistant
              </p>
              <p className="text-xs text-white/60 truncate">
                Ready to help
              </p>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}