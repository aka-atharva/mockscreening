"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Clock, Download, FileDown, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function DataPuurSidebar() {
  const pathname = usePathname()

  const sidebarItems = [
    {
      name: "Data Dashboard",
      href: "/datapuur/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Ingestion",
      href: "/datapuur/ingestion",
      icon: FileDown,
    },
    {
      name: "Transformation",
      href: "/datapuur/transformation",
      icon: Clock,
    },
    {
      name: "Export",
      href: "/datapuur/export",
      icon: Download,
    },
  ]

  return (
    <div className="w-64 h-[calc(100vh-76px)] border-r border-black/10 dark:border-white/10 p-4 bg-background/50">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-foreground font-medium text-lg mb-4 px-4"
      >
        DataPuur Menu
      </motion.h2>
      <nav className="space-y-2">
        {sidebarItems.map((item, index) => {
          const isActive = pathname === item.href || (pathname === "/datapuur" && index === 0)

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-foreground/70 dark:text-gray-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
                )}
              >
                <item.icon
                  className={cn("w-5 h-5 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")}
                />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>
    </div>
  )
}

