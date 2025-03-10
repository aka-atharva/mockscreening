"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  username: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, role?: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
  useFallbackMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for fallback mode
const MOCK_USERS = [
  { username: "admin", password: "admin123", email: "admin@example.com", role: "admin" },
  { username: "researcher", password: "password", email: "researcher@example.com", role: "researcher" },
  { username: "user", password: "password", email: "user@example.com", role: "user" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useFallbackMode, setUseFallbackMode] = useState(false)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user", e)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Check if API is available
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        const getApiUrl = () => {
          // Use the environment variable if available
          if (process.env.NEXT_PUBLIC_API_URL) {
            return process.env.NEXT_PUBLIC_API_URL
          }

          // If we're running in the browser and the URL is relative (starts with /)
          // then use the current origin
          if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL?.startsWith("/")) {
            return `${window.location.origin}${process.env.NEXT_PUBLIC_API_URL}`
          }

          // Default fallback
          return "http://localhost:8000/api"
        }

        const apiUrl = getApiUrl()
        await fetch(`${apiUrl}/health`, {
          method: "GET",
          headers: { Accept: "application/json" },
          // Add a timeout
          signal: AbortSignal.timeout(5000),
        })
        setUseFallbackMode(false)
      } catch (error) {
        console.warn("API unavailable, using fallback mode:", error)
        setUseFallbackMode(true)
      }
    }

    checkApiAvailability()
  }, [])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // If in fallback mode, use mock authentication
      if (useFallbackMode) {
        console.log("Using fallback authentication mode")

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check credentials against mock users
        const mockUser = MOCK_USERS.find((user) => user.username === username && user.password === password)

        if (!mockUser) {
          throw new Error("Invalid username or password")
        }

        // Store user info
        const userData = {
          username: mockUser.username,
          role: mockUser.role,
        }

        localStorage.setItem("token", "mock-token")
        localStorage.setItem("user", JSON.stringify(userData))

        setUser(userData)

        // Redirect based on role - but always to home page first
        router.push("/")

        return
      }

      // Regular API authentication
      const getApiUrl = () => {
        // Use the environment variable if available
        if (process.env.NEXT_PUBLIC_API_URL) {
          return process.env.NEXT_PUBLIC_API_URL
        }

        // If we're running in the browser and the URL is relative (starts with /)
        // then use the current origin
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL?.startsWith("/")) {
          return `${window.location.origin}${process.env.NEXT_PUBLIC_API_URL}`
        }

        // Default fallback
        return "http://localhost:8000/api"
      }

      const apiUrl = getApiUrl()
      const loginUrl = `${apiUrl}/auth/token`

      console.log("Attempting to login at:", loginUrl)

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Received non-JSON response:", text.substring(0, 200) + "...")

        // Automatically switch to fallback mode
        console.log("Switching to fallback mode due to non-JSON response")
        setUseFallbackMode(true)

        throw new Error("Server returned non-JSON response. Switching to fallback mode.")
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Login failed")
      }

      const data = await response.json()

      // Store token and user info
      localStorage.setItem("token", data.access_token)
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          role: data.role,
        }),
      )

      setUser({
        username: data.username,
        role: data.role,
      })

      // Redirect based on role - but always to home page first
      router.push("/")
    } catch (err) {
      console.error("Login error:", err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Login failed. Please check if the API server is running.")
      }

      // If we get a network error or non-JSON response, suggest fallback mode
      if (
        (err instanceof TypeError && err.message === "Failed to fetch") ||
        (err instanceof Error && err.message.includes("non-JSON response"))
      ) {
        setError("Cannot connect to the authentication server. Switching to fallback mode.")
        setUseFallbackMode(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string, role = "user") => {
    setIsLoading(true)
    setError(null)

    try {
      // If in fallback mode, use mock registration
      if (useFallbackMode) {
        console.log("Using fallback registration mode")

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check if username exists
        if (MOCK_USERS.some((user) => user.username === username)) {
          throw new Error("Username already registered")
        }

        // Check if email exists
        if (MOCK_USERS.some((user) => user.email === email)) {
          throw new Error("Email already registered")
        }

        // Add user to mock users (in memory only)
        MOCK_USERS.push({ username, email, password, role })

        // Auto login after registration
        await login(username, password)
        return
      }

      // Regular API registration
      const getApiUrl = () => {
        // Use the environment variable if available
        if (process.env.NEXT_PUBLIC_API_URL) {
          return process.env.NEXT_PUBLIC_API_URL
        }

        // If we're running in the browser and the URL is relative (starts with /)
        // then use the current origin
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL?.startsWith("/")) {
          return `${window.location.origin}${process.env.NEXT_PUBLIC_API_URL}`
        }

        // Default fallback
        return "http://localhost:8000/api"
      }

      const apiUrl = getApiUrl()
      const registerUrl = `${apiUrl}/auth/register`

      console.log("Attempting to register at:", registerUrl)

      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Received non-JSON response:", text)
        throw new Error("Server returned non-JSON response. API might be unavailable.")
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Registration failed")
      }

      // Auto login after registration
      await login(username, password)
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed. Please check if the API server is running.")

      // If we get a network error, suggest fallback mode
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Cannot connect to the registration server. Try using the fallback mode.")
        setUseFallbackMode(true)
      }

      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // If in fallback mode, simulate success
      if (useFallbackMode) {
        console.log("Using fallback forgot password mode")

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check if email exists in mock users
        const mockUser = MOCK_USERS.find((user) => user.email === email)

        // Always return success, even if email doesn't exist (security best practice)
        return
      }

      // Regular API forgot password
      const getApiUrl = () => {
        // Use the environment variable if available
        if (process.env.NEXT_PUBLIC_API_URL) {
          return process.env.NEXT_PUBLIC_API_URL
        }

        // If we're running in the browser and the URL is relative (starts with /)
        // then use the current origin
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL?.startsWith("/")) {
          return `${window.location.origin}${process.env.NEXT_PUBLIC_API_URL}`
        }

        // Default fallback
        return "http://localhost:8000/api"
      }

      const apiUrl = getApiUrl()
      const forgotPasswordUrl = `${apiUrl}/auth/forgot-password`

      console.log("Requesting password reset at:", forgotPasswordUrl)

      const response = await fetch(forgotPasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Received non-JSON response:", text)
        throw new Error("Server returned non-JSON response. API might be unavailable.")
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to process request")
      }
    } catch (err) {
      console.error("Forgot password error:", err)
      setError(
        err instanceof Error ? err.message : "Failed to process request. Please check if the API server is running.",
      )

      // If we get a network error, suggest fallback mode
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Cannot connect to the server. Try using the fallback mode.")
        setUseFallbackMode(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // If in fallback mode, simulate success
      if (useFallbackMode) {
        console.log("Using fallback reset password mode")

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        return
      }

      // Regular API reset password
      const getApiUrl = () => {
        // Use the environment variable if available
        if (process.env.NEXT_PUBLIC_API_URL) {
          return process.env.NEXT_PUBLIC_API_URL
        }

        // If we're running in the browser and the URL is relative (starts with /)
        // then use the current origin
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL?.startsWith("/")) {
          return `${window.location.origin}${process.env.NEXT_PUBLIC_API_URL}`
        }

        // Default fallback
        return "http://localhost:8000/api"
      }

      const apiUrl = getApiUrl()
      const resetPasswordUrl = `${apiUrl}/auth/reset-password`

      console.log("Resetting password at:", resetPasswordUrl)

      const response = await fetch(resetPasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Received non-JSON response:", text)
        throw new Error("Server returned non-JSON response. API might be unavailable.")
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to reset password")
      }
    } catch (err) {
      console.error("Reset password error:", err)
      setError(
        err instanceof Error ? err.message : "Failed to reset password. Please check if the API server is running.",
      )

      // If we get a network error, suggest fallback mode
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Cannot connect to the server. Try using the fallback mode.")
        setUseFallbackMode(true)
      }

      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        isLoading,
        error,
        useFallbackMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

