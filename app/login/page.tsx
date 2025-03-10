"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { SparklesCore } from "@/components/sparkles"
import { motion } from "framer-motion"
import { Lock, Mail, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import ApiStatus from "@/components/api-status"
import Image from "next/image"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading, error, useFallbackMode } = useAuth()
  const router = useRouter()
  const [isLogoAnimating, setIsLogoAnimating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(username, password)
  }

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Return to home button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
        aria-label="Return to home page"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </Link>

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

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
        >
          <div className="flex flex-col items-center mb-6">
            <motion.div
              className="relative w-16 h-16"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsLogoAnimating(true)}
              onHoverEnd={() => setIsLogoAnimating(false)}
              onClick={() => setIsLogoAnimating(true)}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-500/20 z-0"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isLogoAnimating ? 1.2 : 0,
                  opacity: isLogoAnimating ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                animate={{
                  rotate: isLogoAnimating ? [0, 10, -10, 0] : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.8, 1],
                }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/no_bg_logo-M7cBq60PCuZ1sN7MH6T2WMZRrdyQMZ.png"
                  alt="RSW Logo"
                  width={64}
                  height={64}
                  className="object-contain relative z-10"
                />
              </motion.div>
            </motion.div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold text-sm mt-2">
              Cognitive Data Expert
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-6">Login</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md mb-4">
              <p className="font-medium">{error}</p>
              {error.includes("non-JSON response") && (
                <p className="text-sm mt-1">
                  This usually happens when the API server is not running or is misconfigured. The application will use
                  demo mode instead.
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <ApiStatus />
          </div>

          {useFallbackMode && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-2 rounded-md mb-4 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Using Demo Mode</p>
                <p className="text-sm">API server is unavailable. You can use these demo credentials:</p>
                <ul className="text-sm list-disc list-inside mt-1">
                  <li>
                    Admin: username <code>admin</code>, password <code>admin123</code>
                  </li>
                  <li>
                    Researcher: username <code>researcher</code>, password <code>password</code>
                  </li>
                  <li>
                    User: username <code>user</code>, password <code>password</code>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300">
                Forgot your password?
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

