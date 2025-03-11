"use client"

import { useEffect, useState } from "react"
import { RefreshCw, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminStore } from "@/lib/admin/store"
import { fetchAdminData, clearActivityLogs } from "@/lib/admin/api"
import { formatDate, getRelativeTime } from "@/lib/utils/date-formatter"

export function ActivityTab() {
  const { activity, setActivity, isProcessing, setIsProcessing, setNotification } = useAdminStore()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Set up polling for real-time updates
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      handleRefresh(false)
      setLastRefresh(new Date())
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleRefresh = async (showLoading = true) => {
    if (showLoading) {
      setIsProcessing(true)
    }

    try {
      const data = await fetchAdminData()
      setActivity(data.activity)

      if (showLoading) {
        setNotification({
          type: "success",
          message: "Activity logs refreshed successfully",
        })

        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000)
      }
    } catch (error) {
      console.error("Error refreshing activity logs:", error)

      if (showLoading) {
        setNotification({
          type: "error",
          message: "Failed to refresh activity logs",
        })
      }
    } finally {
      if (showLoading) {
        setIsProcessing(false)
      }
    }
  }

  const handleClearLogs = async () => {
    if (confirm("Are you sure you want to clear old activity logs? This cannot be undone.")) {
      setIsProcessing(true)
      try {
        await clearActivityLogs(30)
        setNotification({
          type: "success",
          message: "Activity logs older than 30 days have been cleared",
        })
        // Refresh data to show updated logs
        const data = await fetchAdminData()
        setActivity(data.activity)
      } catch (error) {
        console.error("Error clearing logs:", error)
        setNotification({
          type: "error",
          message: "Failed to clear activity logs",
        })
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-foreground">Activity Log</h2>
        <div className="flex space-x-2">
          <div className="flex items-center mr-4">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="auto-refresh" className="text-sm text-muted-foreground">
              Auto-refresh
            </label>
          </div>
          <Button
            variant="outline"
            className="border-violet-600 text-violet-600 hover:bg-violet-600/20"
            onClick={() => handleRefresh()}
            disabled={isProcessing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/20"
            onClick={handleClearLogs}
            disabled={isProcessing}
          >
            <Trash className="h-4 w-4 mr-2" />
            Clear Old Logs
          </Button>
        </div>
      </div>

      {autoRefresh && (
        <div className="text-xs text-muted-foreground text-right">
          Last refreshed: {formatDate(lastRefresh)} (auto-refreshes every 10 seconds)
        </div>
      )}

      <div className="bg-card p-4 rounded-lg border border-border">
        {activity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No activity logs found</div>
        ) : (
          <div className="space-y-4">
            {activity.map((item) => (
              <div key={item.id} className="p-3 border-b border-border last:border-0">
                <div className="flex justify-between">
                  <div className="text-card-foreground font-medium">{item.action}</div>
                  <div className="text-muted-foreground text-sm flex items-center gap-2">
                    <span>{formatDate(item.timestamp)}</span>
                    <span className="text-xs opacity-70">({getRelativeTime(item.timestamp)})</span>
                  </div>
                </div>
                <div className="text-muted-foreground mt-1">User: {item.username}</div>
                {item.details && <div className="text-muted-foreground text-sm mt-1">{item.details}</div>}
                {item.ip_address && <div className="text-muted-foreground text-xs mt-1">IP: {item.ip_address}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {activity.length > 0 && (
        <div className="text-center text-muted-foreground text-sm">
          Showing {activity.length} most recent activities
        </div>
      )}
    </div>
  )
}

