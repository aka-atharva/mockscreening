import { CheckCircle, AlertCircle } from "lucide-react"

interface NotificationProps {
  notification: {
    type: "success" | "error"
    message: string
  }
}

export function NotificationDisplay({ notification }: NotificationProps) {
  return (
    <div
      className={`mb-4 p-3 rounded-md flex items-center ${
        notification.type === "success"
          ? "bg-violet-500/20 border border-violet-500 text-violet-700 dark:text-violet-200"
          : "bg-red-500/20 border border-red-500 text-red-700 dark:text-red-200"
      }`}
    >
      {notification.type === "success" ? (
        <CheckCircle className="h-5 w-5 mr-2 text-violet-500" />
      ) : (
        <AlertCircle className="h-5 w-5 mr-2" />
      )}
      <p>{notification.message}</p>
    </div>
  )
}

