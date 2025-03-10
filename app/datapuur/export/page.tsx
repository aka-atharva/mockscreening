import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import DataPuurSidebar from "@/components/datapuur-sidebar"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

export default function ExportPage() {
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
              <h1 className="text-4xl font-bold text-white mb-6">Data Export</h1>

              <p className="text-gray-400 text-xl mb-8">Export your processed data in various formats.</p>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Available Exports</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-white/10 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">Customer Data</h4>
                      <p className="text-gray-400 text-sm">Last updated: Today at 10:30 AM</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="text-white border-purple-500 hover:bg-purple-500/20">
                        CSV
                      </Button>
                      <Button variant="outline" className="text-white border-purple-500 hover:bg-purple-500/20">
                        JSON
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-white/10 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">Product Analytics</h4>
                      <p className="text-gray-400 text-sm">Last updated: Yesterday at 4:15 PM</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="text-white border-purple-500 hover:bg-purple-500/20">
                        Excel
                      </Button>
                      <Button variant="outline" className="text-white border-purple-500 hover:bg-purple-500/20">
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Schedule Exports</h3>
                <p className="text-gray-400 mb-4">Set up automated data exports</p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <FileDown className="mr-2 h-4 w-4" />
                  Configure Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

