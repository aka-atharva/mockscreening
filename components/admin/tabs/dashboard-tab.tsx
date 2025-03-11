import { useAdminStore } from "@/lib/admin/store"

export function DashboardTab() {
  const { stats, activity } = useAdminStore()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">System Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium text-card-foreground mb-2">User Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Users:</span>
              <span className="text-card-foreground font-medium">{stats?.total_users}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Users:</span>
              <span className="text-card-foreground font-medium">{stats?.active_users}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Researchers:</span>
              <span className="text-card-foreground font-medium">{stats?.researchers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Regular Users:</span>
              <span className="text-card-foreground font-medium">{stats?.regular_users}</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium text-card-foreground mb-2">System Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="text-card-foreground font-medium">{stats?.system_uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database Size:</span>
              <span className="text-card-foreground font-medium">{stats?.database_size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-violet-500 font-medium">Operational</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium text-card-foreground mb-2">Recent Activity</h3>
          <div className="space-y-2">
            {activity?.slice(0, 3).map((item) => (
              <div key={item.id} className="text-sm">
                <div className="text-card-foreground">{item.action}</div>
                <div className="text-muted-foreground text-xs">
                  {new Date(item.timestamp).toLocaleString()} - {item.username}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

