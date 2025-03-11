// API utility functions for admin dashboard

export async function fetchAdminData() {
  try {
    // Get API base URL
    const getApiUrl = () => {
      if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL
      }
      return "http://localhost:8080/api"
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

    // Fetch activity logs with a timestamp parameter to avoid caching
    let activityData = []
    try {
      const timestamp = new Date().getTime()
      const activityResponse = await fetch(`${apiUrl}/admin/activity?limit=50&_t=${timestamp}`, { headers })
      if (!activityResponse.ok) {
        throw new Error(`Failed to fetch activity logs: ${activityResponse.statusText}`)
      }
      activityData = await activityResponse.json()

      // Ensure timestamps are properly formatted
      activityData = activityData.map((item) => ({
        ...item,
        // Ensure timestamp is in ISO format if it's not already
        timestamp: item.timestamp ? new Date(item.timestamp).toISOString() : new Date().toISOString(),
      }))
    } catch (err) {
      console.error("Error fetching activity logs:", err)
      // Fallback data
      activityData = [
        {
          id: 1,
          action: "User login",
          username: "system",
          timestamp: new Date().toISOString(),
          details: "Activity log system initialized with fallback data",
        },
      ]
    }

    // Fetch system settings
    const settingsResponse = await fetch(`${apiUrl}/admin/settings`, { headers })

    // Check if responses are OK
    if (!statsResponse.ok || !usersResponse.ok || !settingsResponse.ok) {
      throw new Error("Failed to fetch admin data")
    }

    // Parse responses
    const statsData = await statsResponse.json()
    const usersData = await usersResponse.json()
    const settingsData = await settingsResponse.json()

    return {
      stats: statsData,
      users: usersData,
      activity: activityData,
      systemSettings: settingsData,
    }
  } catch (err) {
    console.error("Error fetching admin data:", err)

    // Return mock data as fallback
    return {
      stats: {
        total_users: 42,
        active_users: 38,
        researchers: 15,
        regular_users: 26,
        system_uptime: "3 days, 7 hours",
        database_size: "42.5 MB",
      },
      users: [
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
      ],
      activity: [
        {
          id: 1,
          action: "User login",
          username: "researcher",
          timestamp: new Date().toISOString(),
          details: "Successful login",
        },
        {
          id: 2,
          action: "Data export",
          username: "researcher",
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
          details: "Exported 1,245 records",
        },
        {
          id: 3,
          action: "Failed login attempt",
          username: "unknown",
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
          details: "Invalid credentials",
        },
      ],
      systemSettings: {
        maintenance_mode: false,
        debug_mode: true,
        api_rate_limiting: true,
        last_backup: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
      },
    }
  }
}

export async function updateSystemSetting(setting: string, value: boolean) {
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

  return await response.json()
}

export async function runBackup() {
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

  return { message: "Backup process started" }
}

export async function exportData() {
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

  return { message: "Data export initiated" }
}

export async function cleanupData() {
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

  return { message: "Data cleanup process started" }
}

export async function updateUser(userId: number, userData: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  const token = localStorage.getItem("token")

  try {
    const response = await fetch(`${apiUrl}/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()

      // Check for specific role validation errors
      if (errorData.detail && errorData.detail.includes("Invalid role")) {
        throw new Error(
          `Role "${userData.role}" is not recognized by the system. Please try again or contact the administrator.`,
        )
      }

      throw new Error(errorData.detail || "Failed to update user")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export async function deleteUser(userId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  const token = localStorage.getItem("token")

  const response = await fetch(`${apiUrl}/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Failed to delete user")
  }

  return null
}

export async function createUser(userData: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  const token = localStorage.getItem("token")

  try {
    const response = await fetch(`${apiUrl}/admin/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()

      // Check for specific role validation errors
      if (errorData.detail && errorData.detail.includes("Invalid role")) {
        throw new Error(
          `Role "${userData.role}" is not recognized by the system. Please try again or contact the administrator.`,
        )
      }

      throw new Error(errorData.detail || "Failed to create user")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function clearActivityLogs(days: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  const token = localStorage.getItem("token")

  const response = await fetch(`${apiUrl}/admin/activity/clear?days=${days}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to clear activity logs")
  }

  return { message: "Activity logs cleared successfully" }
}

