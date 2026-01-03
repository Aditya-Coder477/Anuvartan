import { PatientTable } from "@/components/doctor/PatientTable"

export default function DoctorPage() {
  return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h1>
            <p className="text-slate-500 mt-2">Monitor high-risk patients and review chat transcripts.</p>
          </div>
          
          <PatientTable />
        </div>
      </div>
  )
}
