"use client"

import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import KGInsightsSidebar from "@/components/kginsights-sidebar"
import { Button } from "@/components/ui/button"
import { Settings, Plus, Trash } from "lucide-react"

export default function ManageKGraphPage() {
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
          <KGInsightsSidebar />

          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-foreground mb-6">Manage KGraph</h1>

              <p className="text-muted-foreground text-xl mb-8">Configure and manage your knowledge graph settings.</p>

              <div className="bg-card backdrop-blur-sm p-6 rounded-lg border border-border mb-8">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">Graph Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-card-foreground font-medium">Graph Appearance</h4>
                      <p className="text-muted-foreground text-sm">Customize colors, node sizes, and edge styles</p>
                    </div>
                    <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-600/20">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 border border-border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-card-foreground font-medium">Data Sources</h4>
                      <p className="text-muted-foreground text-sm">Manage data sources for the knowledge graph</p>
                    </div>
                    <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-600/20">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-card backdrop-blur-sm p-6 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-card-foreground">Graph Entities</h3>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white btn-glow">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Entity
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-card-foreground font-medium">Person</h4>
                      <p className="text-muted-foreground text-sm">125 instances</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-600/20">
                        Edit
                      </Button>
                      <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/20">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-card-foreground font-medium">Organization</h4>
                      <p className="text-muted-foreground text-sm">87 instances</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-600/20">
                        Edit
                      </Button>
                      <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/20">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-card-foreground font-medium">Location</h4>
                      <p className="text-muted-foreground text-sm">56 instances</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-600/20">
                        Edit
                      </Button>
                      <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/20">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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

