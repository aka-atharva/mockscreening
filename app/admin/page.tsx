"use client"

import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import { motion } from "framer-motion"
import {
  Users,
  Shield,
  Settings,
  Activity,
  BarChart,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  UserPlus,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import LoadingSpinner from "@/components/loading-spinner"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
}

function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [activity, setActivity] = useState([])
  const [systemSettings, setSystemSettings] = useState(null)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)

  // Dialog states
  const [editUserDialog, setEditUserDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    role: "",
    is_active: true,
  })
  const [deleteUserDialog, setDeleteUserDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [addUserDialog, setAddUserDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    is_active: true,
  })

  const fetchAdminData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get API base URL
      const getApiUrl = () => {
        if (process.env.NEXT_PUBLIC_API_URL) {
          return process.env.NEXT_PUBLIC_API_URL
        }
        return "http://localhost:8000/api"
      }

      const apiUrl = getApiUrl()
      const token = localStorage.getItem("token")
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }

      // Fetch system stats
      const statsResponse = await fetch(`${apiUrl}/admin/stats`, { headers })

      // Fetch users
      const usersResponse = await fetch(`${apiUrl}/admin/users`, { headers })

      // Fetch activity
      const activityResponse = await fetch(`${apiUrl}/admin/activity`, { headers })

      // Fetch system settings
      const settingsResponse = await fetch(`${apiUrl}/admin/settings`, { headers })

      // Check if responses are OK
      if (!statsResponse.ok || !usersResponse.ok || !activityResponse.ok || !settingsResponse.ok) {
        throw new Error("Failed to fetch admin data")
      }

      // Parse responses
      const statsData = await statsResponse.json()
      const usersData = await usersResponse.json()
      const activityData = await activityResponse.json()
      const settingsData = await settingsResponse.json()

      // Update state
      setStats(statsData)
      setUsers(usersData)
      setActivity(activityData)
      setSystemSettings(settingsData)
    } catch (err) {
      console.error("Error fetching admin data:", err)
      setError("Failed to load admin data. Using mock data instead.")

      // Use mock data as fallback
      setStats({
        total_users: 42,
        active_users: 38,
        researchers: 15,
        regular_users: 26,
        system_uptime: "3 days, 7 hours",
        database_size: "42.5 MB",
      })

      setUsers([
        {
          id: 1,
          username: "admin",
          email: "admin@example.com",
          role: "admin",
          is_active: true,
          created_at: "2023-01-01T00:00:00",
        },
        {
          id: 2,
          username: "researcher",
          email: "researcher@example.com",
          role: "researcher",
          is_active: true,
          created_at: "2023-01-02T00:00:00",
        },
        {
          id: 3,
          username: "user",
          email: "user@example.com",
          role: "user",
          is_active: true,
          created_at: "2023-01-03T00:00:00",
        },
      ])

      setActivity([
        {
          id: 1,
          action: "User login",
          username: "researcher",
          timestamp: "2023-04-01T10:30:00",
          details: "Successful login",
        },
        {
          id: 2,
          action: "Data export",
          username: "researcher",
          timestamp: "2023-04-01T09:15:00",
          details: "Exported 1,245 records",
        },
        {
          id: 3,
          action: "Failed login attempt",
          username: "unknown",
          timestamp: "2023-04-01T08:45:00",
          details: "Invalid credentials",
        },
      ])

      setSystemSettings({
        maintenance_mode: false,
        debug_mode: true,
        api_rate_limiting: true,
        last_backup: "2023-04-01T08:45:00",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  // Function to update system settings
  const updateSystemSetting = async (setting, value) => {
    try {
      setIsProcessing(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const token = localStorage.getItem("token")

      const response = await fetch(`${apiUrl}/admin/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [setting]: value }),
      })

      if (!response.ok) {
        throw new Error("Failed to update setting")
      }

      const updatedSettings = await response.json()
      setSystemSettings(updatedSettings)

      setNotification({
        type: "success",
        message: `${setting.replace(/_/g, " ")} has been ${value ? "enabled" : "disabled"}`,
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error("Error updating setting:", error)
      setNotification({
        type: "error",
        message: "Failed to update setting",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to run a backup
  const runBackup = async () => {
    try {
      setIsProcessing(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const token = localStorage.getItem("token")

      const response = await fetch(`${apiUrl}/admin/backup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to start backup")
      }

      setNotification({
        type: "success",
        message: "Backup process started",
      })

      // Refresh data after 3 seconds to get updated backup time
      setTimeout(() => {
        fetchAdminData()
        setNotification(null)
      }, 3000)
    } catch (error) {
      console.error("Error starting backup:", error)
      setNotification({
        type: "error",
        message: "Failed to start backup",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to export data
  const exportData = async () => {
    try {
      setIsProcessing(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const token = localStorage.getItem("token")

      const response = await fetch(`${apiUrl}/admin/export-data`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to export data")
      }

      setNotification({
        type: "success",
        message: "Data export initiated",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error("Error exporting data:", error)
      setNotification({
        type: "error",
        message: "Failed to export data",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to clean up data
  const cleanupData = async () => {
    try {
      setIsProcessing(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const token = localStorage.getItem("token")

      const response = await fetch(`${apiUrl}/admin/cleanup-data`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to clean up data")
      }

      setNotification({
        type: "success",
        message: "Data cleanup process started",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error("Error cleaning up data:", error)
      setNotification({
        type: "error",
        message: "Failed to clean up data",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to open edit user dialog
  const openEditUserDialog = (user) => {
    setCurrentUser(user)
    setEditedUser({
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    })
    setEditUserDialog(true)
  }

  // Function to save user changes
  const saveUserChanges = async () => {
    try {
      setIsProcessing(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const token = localStorage.getItem("token")

      const response = await fetch(`${apiUrl}/admin/users/${currentUser.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to update user")
      }

      const updatedUser = await response.json()

      // Update users list
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))

      setNotification({
        type: "success",
        message: `User ${updatedUser.username} updated successfully`,
      })

      // Close dialog
      setEditUserDialog(false)

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error("Error updating user:", error)
      setNotification({
        type: "error",
        message: error.message || "Failed to update user",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to open delete user dialog
  const openDeleteUserDialog = (user) => {
    setCurrentUser(user)
    setDeleteUserDialog(true)
  }

  // Function to delete user
  const deleteUser = async () => {
    try {
      setIsProcessing(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const token = localStorage.getItem("token")

      const response = await fetch(`${apiUrl}/admin/users/${currentUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to delete user")
      }

      // Update users list
      setUsers(users.filter((u) => u.id !== currentUser.id))

      setNotification({
        type: "success",
        message: `User ${currentUser.username} deleted successfully`,
      })

      // Close dialog
      setDeleteUserDialog(false)

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error("Error deleting user:", error)
      setNotification({
        type: "error",
        message: error.message || "Failed to delete user",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const createUser = async () => {
    try {
      setIsProcessing(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const token = localStorage.getItem("token")

      const response = await fetch(`${apiUrl}/admin/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create user")
      }

      const createdUser = await response.json()

      // Update users list
      setUsers([...users, createdUser])

      setNotification({
        type: "success",
        message: `User ${createdUser.username} created successfully`,
      })

      // Close dialog and reset form
      setAddUserDialog(false)
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "user",
        is_active: true,
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error("Error creating user:", error)
      setNotification({
        type: "error",
        message: error.message || "Failed to create user",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart },
    { id: "users", label: "Users", icon: Users },
    { id: "activity", label: "Activity Log", icon: Activity },
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10">
        <Navbar />

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
              <div className="px-4 py-2 bg-white/5 dark:bg-white/5 bg-black/5 backdrop-blur-sm rounded-lg border border-white/10 dark:border-white/10 border-black/10">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold">
                  Welcome, {user?.username}
                </span>
              </div>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mb-4 p-3 rounded-md flex items-center ${
                notification.type === "success"
                  ? "bg-green-500/20 border border-green-500 text-green-200"
                  : "bg-red-500/20 border border-red-500 text-red-200"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <p>{notification.message}</p>
            </div>
          )}

          <div className="bg-white/5 dark:bg-white/5 bg-black/5 backdrop-blur-sm rounded-lg border border-white/10 dark:border-white/10 border-black/10 overflow-hidden">
            <div className="flex border-b border-white/10 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-white bg-purple-500/20 border-b-2 border-purple-500"
                      : "text-foreground/70 dark:text-gray-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-2 rounded-md mb-4">
                      <p>{error}</p>
                    </div>
                  )}

                  {activeTab === "dashboard" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-4">System Overview</h2>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 dark:bg-white/5 bg-black/5 p-6 rounded-lg border border-white/10 dark:border-white/10 border-black/10">
                          <h3 className="text-lg font-medium text-foreground mb-2">User Statistics</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-foreground/70 dark:text-gray-400">Total Users:</span>
                              <span className="text-foreground font-medium">{stats?.total_users}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-foreground/70 dark:text-gray-400">Active Users:</span>
                              <span className="text-foreground font-medium">{stats?.active_users}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-foreground/70 dark:text-gray-400">Researchers:</span>
                              <span className="text-foreground font-medium">{stats?.researchers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-foreground/70 dark:text-gray-400">Regular Users:</span>
                              <span className="text-foreground font-medium">{stats?.regular_users}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 dark:bg-white/5 bg-black/5 p-6 rounded-lg border border-white/10 dark:border-white/10 border-black/10">
                          <h3 className="text-lg font-medium text-foreground mb-2">System Status</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-foreground/70 dark:text-gray-400">Uptime:</span>
                              <span className="text-foreground font-medium">{stats?.system_uptime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-foreground/70 dark:text-gray-400">Database Size:</span>
                              <span className="text-foreground font-medium">{stats?.database_size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-foreground/70 dark:text-gray-400">Status:</span>
                              <span className="text-green-500 font-medium">Operational</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 dark:bg-white/5 bg-black/5 p-6 rounded-lg border border-white/10 dark:border-white/10 border-black/10">
                          <h3 className="text-lg font-medium text-foreground mb-2">Recent Activity</h3>
                          <div className="space-y-2">
                            {activity?.slice(0, 3).map((item) => (
                              <div key={item.id} className="text-sm">
                                <div className="text-foreground">{item.action}</div>
                                <div className="text-gray-400 text-xs">
                                  {new Date(item.timestamp).toLocaleString()} - {item.username}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "users" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-foreground">User Management</h2>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => setAddUserDialog(true)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </div>

                      <div className="bg-white/5 dark:bg-white/5 bg-black/5 p-4 rounded-lg border border-white/10 dark:border-white/10 border-black/10 overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="p-3 text-gray-400">ID</th>
                              <th className="p-3 text-gray-400">Username</th>
                              <th className="p-3 text-gray-400">Email</th>
                              <th className="p-3 text-gray-400">Role</th>
                              <th className="p-3 text-gray-400">Status</th>
                              <th className="p-3 text-gray-400">Created</th>
                              <th className="p-3 text-gray-400">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users?.map((user) => (
                              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-3 text-foreground">{user.id}</td>
                                <td className="p-3 text-foreground">{user.username}</td>
                                <td className="p-3 text-foreground">{user.email}</td>
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      user.role === "admin"
                                        ? "bg-purple-500 text-white"
                                        : user.role === "researcher"
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-500 text-white"
                                    }`}
                                  >
                                    {user.role}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      user.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                    }`}
                                  >
                                    {user.is_active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td className="p-3 text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="p-3">
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7 border-purple-500 text-white hover:bg-purple-500/20"
                                      onClick={() => openEditUserDialog(user)}
                                    >
                                      Edit
                                    </Button>
                                    {user.username !== "admin" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7 border-red-500 text-white hover:bg-red-500/20"
                                        onClick={() => openDeleteUserDialog(user)}
                                      >
                                        Delete
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "activity" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-4">Activity Log</h2>

                      <div className="bg-white/5 dark:bg-white/5 bg-black/5 p-4 rounded-lg border border-white/10 dark:border-white/10 border-black/10">
                        <div className="space-y-4">
                          {activity?.map((item) => (
                            <div key={item.id} className="p-3 border-b border-white/10 last:border-0">
                              <div className="flex justify-between">
                                <div className="text-foreground font-medium">{item.action}</div>
                                <div className="text-gray-400 text-sm">{new Date(item.timestamp).toLocaleString()}</div>
                              </div>
                              <div className="text-gray-400 mt-1">User: {item.username}</div>
                              <div className="text-gray-400 text-sm mt-1">{item.details}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "permissions" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-4">Permissions</h2>
                      <p className="text-gray-400 mb-6">
                        Configure role-based permissions and access controls for your application.
                      </p>

                      <div className="bg-white/5 dark:bg-white/5 bg-black/5 p-6 rounded-lg border border-white/10 dark:border-white/10 border-black/10">
                        <h3 className="text-lg font-medium text-foreground mb-4">Role Management</h3>
                        <div className="space-y-4">
                          <div className="p-4 border border-white/10 rounded-lg">
                            <h4 className="text-foreground font-medium mb-2">Admin</h4>
                            <p className="text-gray-400 text-sm mb-2">
                              Full access to all system features and settings.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-foreground">
                                User Management
                              </span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-foreground">
                                System Settings
                              </span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-foreground">
                                Data Management
                              </span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-foreground">
                                Activity Logs
                              </span>
                            </div>
                          </div>

                          <div className="p-4 border border-white/10 rounded-lg">
                            <h4 className="text-foreground font-medium mb-2">Researcher</h4>
                            <p className="text-gray-400 text-sm mb-2">
                              Access to research tools and data analysis features.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-foreground">DataPuur</span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-foreground">
                                KGInsights
                              </span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-foreground">
                                Data Management
                              </span>
                            </div>
                          </div>

                          <div className="p-4 border border-white/10 rounded-lg">
                            <h4 className="text-foreground font-medium mb-2">User</h4>
                            <p className="text-gray-400 text-sm mb-2">Basic access to application features.</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-foreground">
                                View Reports
                              </span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-foreground">
                                Personal Settings
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-4">Settings</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 dark:bg-white/5 bg-black/5 p-6 rounded-lg border border-white/10 dark:border-white/10 border-black/10">
                          <h3 className="text-lg font-medium text-foreground mb-4">System Settings</h3>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 border-b border-white/10">
                              <div>
                                <h4 className="text-foreground font-medium">Maintenance Mode</h4>
                                <p className="text-gray-400 text-xs">Temporarily disable access to the application</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="maintenance-mode"
                                  checked={systemSettings?.maintenance_mode || false}
                                  onCheckedChange={(checked) => updateSystemSetting("maintenance_mode", checked)}
                                  disabled={isProcessing}
                                />
                                <Label htmlFor="maintenance-mode" className="sr-only">
                                  Maintenance Mode
                                </Label>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-3 border-b border-white/10">
                              <div>
                                <h4 className="text-foreground font-medium">Debug Mode</h4>
                                <p className="text-gray-400 text-xs">Enable detailed error messages and logging</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="debug-mode"
                                  checked={systemSettings?.debug_mode || false}
                                  onCheckedChange={(checked) => updateSystemSetting("debug_mode", checked)}
                                  disabled={isProcessing}
                                />
                                <Label htmlFor="debug-mode" className="sr-only">
                                  Debug Mode
                                </Label>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-3 border-b border-white/10">
                              <div>
                                <h4 className="text-foreground font-medium">API Rate Limiting</h4>
                                <p className="text-gray-400 text-xs">Limit API requests per user</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="api-rate-limiting"
                                  checked={systemSettings?.api_rate_limiting || false}
                                  onCheckedChange={(checked) => updateSystemSetting("api_rate_limiting", checked)}
                                  disabled={isProcessing}
                                />
                                <Label htmlFor="api-rate-limiting" className="sr-only">
                                  API Rate Limiting
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 dark:bg-white/5 bg-black/5 p-6 rounded-lg border border-white/10 dark:border-white/10 border-black/10">
                          <h3 className="text-lg font-medium text-foreground mb-4">Data Management</h3>
                          <div className="space-y-4">
                            <div className="p-3 border-b border-white/10">
                              <h4 className="text-foreground font-medium mb-2">Database Backup</h4>
                              <p className="text-gray-400 text-xs mb-3">
                                Last backup:{" "}
                                {systemSettings?.last_backup
                                  ? new Date(systemSettings.last_backup).toLocaleString()
                                  : "Never"}
                              </p>
                              <Button
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8"
                                onClick={runBackup}
                                disabled={isProcessing}
                              >
                                {isProcessing ? (
                                  <>
                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                    Running...
                                  </>
                                ) : (
                                  "Run Backup Now"
                                )}
                              </Button>
                            </div>

                            <div className="p-3 border-b border-white/10">
                              <h4 className="text-foreground font-medium mb-2">Data Export</h4>
                              <p className="text-gray-400 text-xs mb-3">Export system data for backup or migration</p>
                              <Button
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8"
                                onClick={exportData}
                                disabled={isProcessing}
                              >
                                {isProcessing ? (
                                  <>
                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                    Exporting...
                                  </>
                                ) : (
                                  "Export Data"
                                )}
                              </Button>
                            </div>

                            <div className="p-3 border-b border-white/10">
                              <h4 className="text-foreground font-medium mb-2">Data Cleanup</h4>
                              <p className="text-gray-400 text-xs mb-3">Remove old or unused data from the system</p>
                              <Button
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8"
                                onClick={cleanupData}
                                disabled={isProcessing}
                              >
                                {isProcessing ? (
                                  <>
                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                    Cleaning...
                                  </>
                                ) : (
                                  "Cleanup Data"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
        <DialogContent className="bg-black/90 border border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editedUser.username}
                onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                className="bg-white/5 border-white/10 text-foreground"
                disabled={currentUser?.username === "admin"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                className="bg-white/5 border-white/10 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={editedUser.role}
                onValueChange={(value) => setEditedUser({ ...editedUser, role: value })}
                disabled={currentUser?.username === "admin"}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-foreground">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={editedUser.is_active}
                onCheckedChange={(checked) => setEditedUser({ ...editedUser, is_active: checked })}
                disabled={currentUser?.username === "admin"}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={saveUserChanges}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteUserDialog} onOpenChange={setDeleteUserDialog}>
        <DialogContent className="bg-black/90 border border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete user <span className="font-bold">{currentUser?.username}</span>?
            </p>
            <p className="text-red-400 text-sm mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={deleteUser} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addUserDialog} onOpenChange={setAddUserDialog}>
        <DialogContent className="bg-black/90 border border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-username">Username</Label>
              <Input
                id="new-username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="bg-white/5 border-white/10 text-foreground"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="bg-white/5 border-white/10 text-foreground"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="bg-white/5 border-white/10 text-foreground"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-foreground">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="new-is_active"
                checked={newUser.is_active}
                onCheckedChange={(checked) => setNewUser({ ...newUser, is_active: checked })}
              />
              <Label htmlFor="new-is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={createUser}
              disabled={isProcessing || !newUser.username || !newUser.email || !newUser.password}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

