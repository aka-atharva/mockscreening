"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import LoadingSpinner from "@/components/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    } else if (!isLoading && user && requiredRole) {
      // Check role permissions
      if (
        (requiredRole === "admin" && user.role !== "admin") ||
        (requiredRole === "researcher" && !["admin", "researcher"].includes(user.role))
      ) {
        // Redirect to home if not authorized
        router.push("/")
      }
    }
  }, [user, isLoading, router, pathname, requiredRole])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black/[0.96] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // If checking role and user doesn't have required role, don't render children
  if (
    requiredRole &&
    user &&
    ((requiredRole === "admin" && user.role !== "admin") ||
      (requiredRole === "researcher" && !["admin", "researcher"].includes(user.role)))
  ) {
    return null
  }

  // If not authenticated, don't render children
  if (!user) {
    return null
  }

  // Render children if authenticated and authorized
  return <>{children}</>
}

