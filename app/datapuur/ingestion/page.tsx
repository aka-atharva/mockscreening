import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import DataPuurSidebar from "@/components/datapuur-sidebar"
import { Button } from "@/components/ui/button"
import { FileUp } from "lucide-react"

export default function IngestionPage() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
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

      <div className="relative z-10">
        <Navbar />

        <div className="flex">
          <DataPuurSidebar />

          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-6">Data Ingestion</h1>

              <p className="text-gray-400 text-xl mb-8">Import and collect data from various sources.</p>

              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Upload Data</h3>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                  <FileUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Drag and drop files here, or click to browse</p>
                  <Button className="bg-purple-600 hover:bg-purple-700">Select Files</Button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Data Sources</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-white/10 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">Database Connection</h4>
                      <p className="text-gray-400 text-sm">Connect to SQL, NoSQL, or other databases</p>
                    </div>
                    <Button variant="outline" className="text-white border-purple-500 hover:bg-purple-500/20">
                      Connect
                    </Button>
                  </div>

                  <div className="p-4 border border-white/10 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">API Integration</h4>
                      <p className="text-gray-400 text-sm">Connect to external APIs</p>
                    </div>
                    <Button variant="outline" className="text-white border-purple-500 hover:bg-purple-500/20">
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

