import { VisitList } from "@/components/nurse/VisitList"

export default function NursePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Mobile Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900">Today's Visits</h1>
        <p className="text-sm text-slate-500">Priority List</p>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <VisitList />
      </div>
    </div>
  )
}
