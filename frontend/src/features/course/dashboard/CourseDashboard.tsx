import { Button } from "@/components/ui/button"
import { Navbar } from "../../home/components/Navbar"
import { LayoutDashboard } from "lucide-react"

export const CourseDashboard = () => {
  return (
    <>
      <div className="h-screen text-white">
        <Navbar></Navbar>
        <div className="relative flex flex-col md:flex-row w-full h-full">
          <div className="w-72 h-full border-r p-6 flex flex-col pt-16 bg-stone-950">
            <h1 className="text-sm text-stone-400">Home</h1>
            <Button variant={"ghost"} className="text-start justify-start">
              <LayoutDashboard></LayoutDashboard>
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}