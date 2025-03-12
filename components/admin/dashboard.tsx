"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart, Users, Activity, Shield, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useAdminLogout } from "@/components/admin-logout-fix"
import { fetchAdminData } from "@/lib/admin/api"
import { AdminTabs } from "@/components/admin/tabs"
import { NotificationDisplay } from "@/components/admin/notification"
import { useAdminStore } from "@/lib/admin/store"
import LoadingSpinner from "@/components/loading-spinner"

export default function AdminDashboard() {
  const { user } = useAuth()
  const logout = useAdminLogout()
  const [activeTab, setActiveTab] = useState("dashboard")
  const {
    loading,
    setLoading,
    error,
    setError,
    notification,
    setNotification,
    stats,
    setStats,
    users,
    setUsers,
    activity,
    setActivity,
    systemSettings,
    setSystemSettings,
    addRoleIfNotExists,
  } = useAdminStore()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const data = await fetchAdminData()

        // Ensure we have valid data before setting state
        if (data) {
          setStats(data.stats || {})
          setUsers(data.users || [])
          setActivity(data.activity || [])
          setSystemSettings(data.systemSettings || {})

          // Ensure all roles from users are in our roles list
          if (data.users && data.users.length > 0) {
            data.users.forEach((user) => {
              if (user.role) {
                addRoleIfNotExists(user.role)
              }
            })
          }
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching admin data:", err)
        setError("Failed to load admin data. Using mock data instead.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart },
    { id: "users", label: "Users", icon: Users },
    { id: "activity", label: "Activity Log", icon: Activity },
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Admin Dashboard
        </motion.h1>

        <div className="flex items-center">
          <div className="px-4 py-2 bg-card backdrop-blur-sm rounded-lg border border-border">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold">
              Welcome, {user?.username}
            </span>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && <NotificationDisplay notification={notification} />}

      <div className="bg-card backdrop-blur-sm rounded-lg border border-border overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-primary-foreground bg-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          )}
          {!loading && <AdminTabs activeTab={activeTab} loading={loading} error={error} />}
        </div>
      </div>
    </div>
  )
}

