"use client"

import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import DataPuurSidebar from "@/components/datapuur-sidebar"
import { Button } from "@/components/ui/button"
import { FileUp } from "lucide-react"

export default function IngestionPage() {
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
              <h1 className="text-4xl font-bold text-foreground mb-6">Data Ingestion</h1>

              <p className="text-muted-foreground text-xl mb-8">Import and collect data from various sources.</p>

              <div className="bg-card backdrop-blur-sm p-8 rounded-lg border border-border mb-8">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">Upload Data</h3>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileUp className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white btn-glow">Select Files</Button>
                </div>
              </div>

              <div className="bg-card backdrop-blur-sm p-6 rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">Data Sources</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-card-foreground font-medium">Database Connection</h4>
                      <p className="text-muted-foreground text-sm">Connect to SQL, NoSQL, or other databases</p>
                    </div>
                    <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-600/20">
                      Connect
                    </Button>
                  </div>

                  <div className="p-4 border border-border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-card-foreground font-medium">API Integration</h4>
                      <p className="text-muted-foreground text-sm">Connect to external APIs</p>
                    </div>
                    <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-600/20">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

