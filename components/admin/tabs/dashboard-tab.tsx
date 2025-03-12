import { useAdminStore } from "@/lib/admin/store"

export function DashboardTab() {
  const { stats, activity } = useAdminStore()

  // Add a check for stats being null or undefined
  if (!stats) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">System Overview</h2>
        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-muted-foreground">Loading system statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">System Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium text-card-foreground mb-4">User Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Users:</span>
              <span className="text-card-foreground font-medium">{stats?.total_users || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Active Users:</span>
              <span className="text-card-foreground font-medium">{stats?.active_users || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Researchers:</span>
              <span className="text-card-foreground font-medium">{stats?.researchers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Regular Users:</span>
              <span className="text-card-foreground font-medium">{stats?.regular_users || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium text-card-foreground mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="text-card-foreground font-medium">{stats?.system_uptime || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Database Size:</span>
              <span className="text-card-foreground font-medium">{stats?.database_size || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-violet-500 font-medium">Operational</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium text-card-foreground mb-4">Recent Activity</h3>
          {activity && activity.length > 0 ? (
            <div className="space-y-3">
              {activity.slice(0, 3).map((item, index) => (
                <div key={item.id || index} className="text-sm">
                  <div className="text-card-foreground font-medium">{item.action}</div>
                  <div className="text-muted-foreground text-xs">
                    {new Date(item.timestamp).toLocaleString()} - {item.username}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}

