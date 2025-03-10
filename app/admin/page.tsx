"use client"

import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import { motion } from "framer-motion"
import { Users, Shield, Settings, Activity, BarChart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import LoadingSpinner from "@/components/loading-spinner"

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
  const [error, setError] = useState(null)

  useEffect(() => {
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

        // Fetch system stats
        const statsResponse = await fetch(`${apiUrl}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        })

        // Fetch users
        const usersResponse = await fetch(`${apiUrl}/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        })

        // Fetch activity
        const activityResponse = await fetch(`${apiUrl}/admin/activity`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        })

        // Check if responses are OK
        if (!statsResponse.ok || !usersResponse.ok || !activityResponse.ok) {
          throw new Error("Failed to fetch admin data")
        }

        // Parse responses
        const statsData = await statsResponse.json()
        const usersData = await usersResponse.json()
        const activityData = await activityResponse.json()

        // Update state
        setStats(statsData)
        setUsers(usersData)
        setActivity(activityData)
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
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart },
    { id: "users", label: "Users", icon: Users },
    { id: "activity", label: "Activity Log", icon: Activity },
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
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
              <div className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold">
                  Welcome, {user?.username}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
            <div className="flex border-b border-white/10 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-white bg-purple-500/20 border-b-2 border-purple-500"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
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
                      <h2 className="text-2xl font-bold text-white mb-4">System Overview</h2>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                          <h3 className="text-lg font-medium text-white mb-2">User Statistics</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Users:</span>
                              <span className="text-white font-medium">{stats?.total_users}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Active Users:</span>
                              <span className="text-white font-medium">{stats?.active_users}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Researchers:</span>
                              <span className="text-white font-medium">{stats?.researchers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Regular Users:</span>
                              <span className="text-white font-medium">{stats?.regular_users}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                          <h3 className="text-lg font-medium text-white mb-2">System Status</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Uptime:</span>
                              <span className="text-white font-medium">{stats?.system_uptime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Database Size:</span>
                              <span className="text-white font-medium">{stats?.database_size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Status:</span>
                              <span className="text-green-500 font-medium">Operational</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                          <h3 className="text-lg font-medium text-white mb-2">Recent Activity</h3>
                          <div className="space-y-2">
                            {activity?.slice(0, 3).map((item) => (
                              <div key={item.id} className="text-sm">
                                <div className="text-white">{item.action}</div>
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
                      <h2 className="text-2xl font-bold text-white mb-4">User Management</h2>

                      <div className="bg-white/5 p-4 rounded-lg border border-white/10 overflow-x-auto">
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
                                <td className="p-3 text-white">{user.id}</td>
                                <td className="p-3 text-white">{user.username}</td>
                                <td className="p-3 text-white">{user.email}</td>
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
                                    >
                                      Edit
                                    </Button>
                                    {user.username !== "admin" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7 border-red-500 text-white hover:bg-red-500/20"
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
                      <h2 className="text-2xl font-bold text-white mb-4">Activity Log</h2>

                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="space-y-4">
                          {activity?.map((item) => (
                            <div key={item.id} className="p-3 border-b border-white/10 last:border-0">
                              <div className="flex justify-between">
                                <div className="text-white font-medium">{item.action}</div>
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
                      <h2 className="text-2xl font-bold text-white mb-4">Permissions</h2>
                      <p className="text-gray-400 mb-6">
                        Configure role-based permissions and access controls for your application.
                      </p>

                      <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                        <h3 className="text-lg font-medium text-white mb-4">Role Management</h3>
                        <div className="space-y-4">
                          <div className="p-4 border border-white/10 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Admin</h4>
                            <p className="text-gray-400 text-sm mb-2">
                              Full access to all system features and settings.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white">
                                User Management
                              </span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white">
                                System Settings
                              </span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white">
                                Data Management
                              </span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white">Activity Logs</span>
                            </div>
                          </div>

                          <div className="p-4 border border-white/10 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Researcher</h4>
                            <p className="text-gray-400 text-sm mb-2">
                              Access to research tools and data analysis features.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white">DataPuur</span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white">KGInsights</span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white">
                                Data Management
                              </span>
                            </div>
                          </div>

                          <div className="p-4 border border-white/10 rounded-lg">
                            <h4 className="text-white font-medium mb-2">User</h4>
                            <p className="text-gray-400 text-sm mb-2">Basic access to application features.</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white">View Reports</span>
                              <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white">
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
                      <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                          <h3 className="text-lg font-medium text-white mb-4">System Settings</h3>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 border-b border-white/10">
                              <div>
                                <h4 className="text-white font-medium">Maintenance Mode</h4>
                                <p className="text-gray-400 text-xs">Temporarily disable access to the application</p>
                              </div>
                              <div className="w-12 h-6 bg-white/10 rounded-full relative">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full"></div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-3 border-b border-white/10">
                              <div>
                                <h4 className="text-white font-medium">Debug Mode</h4>
                                <p className="text-gray-400 text-xs">Enable detailed error messages and logging</p>
                              </div>
                              <div className="w-12 h-6 bg-purple-500/30 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-purple-500 rounded-full"></div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-3 border-b border-white/10">
                              <div>
                                <h4 className="text-white font-medium">API Rate Limiting</h4>
                                <p className="text-gray-400 text-xs">Limit API requests per user</p>
                              </div>
                              <div className="w-12 h-6 bg-purple-500/30 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-purple-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                          <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
                          <div className="space-y-4">
                            <div className="p-3 border-b border-white/10">
                              <h4 className="text-white font-medium mb-2">Database Backup</h4>
                              <p className="text-gray-400 text-xs mb-3">Last backup: 2 days ago</p>
                              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8">
                                Run Backup Now
                              </Button>
                            </div>

                            <div className="p-3 border-b border-white/10">
                              <h4 className="text-white font-medium mb-2">Data Export</h4>
                              <p className="text-gray-400 text-xs mb-3">Export system data for backup or migration</p>
                              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8">
                                Export Data
                              </Button>
                            </div>

                            <div className="p-3 border-b border-white/10">
                              <h4 className="text-white font-medium mb-2">Data Cleanup</h4>
                              <p className="text-gray-400 text-xs mb-3">Remove old or unused data from the system</p>
                              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8">
                                Cleanup Data
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
    </main>
  )
}

