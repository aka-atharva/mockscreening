"use client"

import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import DataPuurSidebar from "@/components/datapuur-sidebar"
import { Button } from "@/components/ui/button"

export default function TransformationPage() {
  return (
    <main className="min-h-screen bg-background antialiased relative overflow-hidden">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="var(--foreground)"
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="flex">
          <DataPuurSidebar />

          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-foreground mb-6">Data Transformation</h1>

              <p className="text-muted-foreground text-xl mb-8">Transform and clean your data for analysis.</p>

              <div className="bg-card backdrop-blur-sm p-6 rounded-lg border border-border mb-8">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">Transformation Pipelines</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-card-foreground font-medium">Customer Data Pipeline</h4>
                      <p className="text-muted-foreground text-sm">Last run: 2 hours ago</p>
                    </div>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white btn-glow">Run</Button>
                  </div>

                  <div className="p-4 border border-border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-card-foreground font-medium">Product Data Pipeline</h4>
                      <p className="text-muted-foreground text-sm">Last run: 1 day ago</p>
                    </div>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white btn-glow">Run</Button>
                  </div>
                </div>
              </div>

              <div className="bg-card backdrop-blur-sm p-6 rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">Create New Transformation</h3>
                <p className="text-muted-foreground mb-4">Design a new data transformation pipeline</p>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/20">
                  Create Pipeline
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

