"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Clock, FileText, MapPin, Phone } from "lucide-react"
import { useEffect, useState } from "react"

type Patient = {
  id: number
  userId?: string
  name: string
  age: number
  condition: string
  risk: number
  lastCheckup: string
  today_aura?: {
    summary: {
      pain_score: number
      fever_celsius: number
      wound_status: string
      meds_taken: boolean
      activity_level: string
      mood: number
    }
    transcript: Array<{ from: string; time: string; text: string }>
    risk_analysis: {
      risk_score: number
      risk_band: string
      top_factors: Array<{ feature: string; impact: string }>
      nurse_action_hint: string
    }
  }
}

export function VisitList() {
  const [visits, setVisits] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHistoryPatient, setSelectedHistoryPatient] = useState<Patient | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/doctor/patients")
        const data = await res.json()
        // Filter for High Risk (> 50) as "Today's Visits"
        // Show all patients for Today's Visits in Demo
        if (Array.isArray(data)) {
             setVisits(data)
        } else {
             console.error("Expected array from API, got:", data)
             setVisits([])
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  }

    /* Visited State for Feedback */
  const [visitedIds, setVisitedIds] = useState<number[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const handleStartVisit = (id: number, name: string) => {
      // Add visual pop
      setVisitedIds(prev => [...prev, id])
      setToastMessage(`Visit started for ${name}`)
      setShowToast(true)
      
      // Auto hide toast
      setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="space-y-4 relative">
       {/* Toast Notification */}
       {showToast && (
          <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
            <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-slate-700">
                <div className="bg-green-500 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                     <p className="font-semibold text-sm">Action Confirmed</p>
                     <p className="text-xs text-slate-300">{toastMessage}</p>
                </div>
            </div>
          </div>
       )}

      {visits.map((patient) => {
        const theme = patient.risk > 70 
            ? { border: "border-l-red-500", bg: "bg-red-50/50", badge: "bg-red-100 text-red-700", button: "bg-red-600 hover:bg-red-700" } 
            : patient.risk > 40
                ? { border: "border-l-orange-500", bg: "bg-orange-50/50", badge: "bg-orange-100 text-orange-700", button: "bg-orange-600 hover:bg-orange-700" }
                : { border: "border-l-teal-500", bg: "bg-teal-50/50", badge: "bg-teal-100 text-teal-700", button: "bg-teal-600 hover:bg-teal-700" };
        
        const isVisited = visitedIds.includes(patient.id);

        return (
        <div key={patient.id} className={`p-4 rounded-xl shadow-sm border border-slate-100 border-l-[6px] flex flex-col gap-3 transition-all duration-300 ${theme.border} ${theme.bg}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">{patient.name}</h3>
              <p className="text-slate-600 text-sm font-medium">{patient.condition}, {patient.age} yrs</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badge} border border-black/5`}>
               <AlertCircle className="w-3 h-3" />
               {patient.risk > 70 ? 'High Risk' : 'Medium Risk'}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-600">
             <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Last: {patient.lastCheckup}</span>
             </div>
             <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>2.5 km away</span>
             </div>
          </div>


          {/* Expanded Report Section */}
          {expandedId === patient.id && (
              <div className="mt-2 p-3 bg-white/60 rounded-lg border border-slate-200/60 text-sm space-y-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        {patient.today_aura ? "Today's AURA Check-in" : "Latest Vitals & Report"}
                    </h4>
                    {patient.today_aura && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium border border-yellow-200">
                             AI Risk: {patient.today_aura.risk_analysis.risk_score} ({patient.today_aura.risk_analysis.risk_band})
                        </span>
                    )}
                  </div>

                  {patient.today_aura ? (
                     <div className="space-y-3">
                        {/* AURA Summary Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white p-2 rounded border border-slate-100 shadow-sm">
                                <span className="block text-xs text-slate-500">Pain Level</span>
                                <span className="font-medium text-slate-900">{patient.today_aura.summary.pain_score}/10</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-100 shadow-sm">
                                <span className="block text-xs text-slate-500">Temp</span>
                                <span className="font-medium text-slate-900">{patient.today_aura.summary.fever_celsius}°C</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-100 shadow-sm col-span-2">
                                <span className="block text-xs text-slate-500">Wound Status</span>
                                <span className="font-medium text-slate-900 text-xs">{patient.today_aura.summary.wound_status}</span>
                            </div>
                        </div>

                        {/* Top Risk Factors */}
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                           <span className="block text-xs text-slate-500 mb-1.5">Top Risk Factors</span>
                           <div className="space-y-1">
                               {patient.today_aura.risk_analysis.top_factors.map((factor, idx) => (
                                   <div key={idx} className="flex justify-between text-xs">
                                       <span className="text-slate-700">{factor.feature}</span>
                                       <span className={factor.impact.startsWith('+') ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                                           {factor.impact}
                                       </span>
                                   </div>
                               ))}
                           </div>
                        </div>

                        {/* Nurse Action Hint */}
                        <div className="bg-blue-50 p-2 rounded border border-blue-100 text-xs text-blue-800 flex gap-2 items-start">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>{patient.today_aura.risk_analysis.nurse_action_hint}</p>
                        </div>
                     </div>
                  ) : (
                    // Fallback for non-detailed patients
                    <>
                      <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white p-2 rounded border border-slate-100 shadow-sm">
                              <span className="block text-xs text-slate-500">BP (mmHg)</span>
                              <span className="font-medium">138/88</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-slate-100 shadow-sm">
                              <span className="block text-xs text-slate-500">Heart Rate</span>
                              <span className="font-medium">88 bpm</span>
                          </div>
                      </div>
                      <div>
                          <span className="block text-xs text-slate-500 mb-1">Doctor's Notes</span>
                          <p className="text-slate-700 leading-relaxed italic border-l-2 border-slate-300 pl-3">
                            "Patient reported increased pain levels. Monitor wound healing progress."
                          </p>
                      </div>
                    </>
                  )}
              </div>
          )}

          <div className="pt-3 border-t border-black/5 flex gap-2">
            <Button 
                onClick={() => handleStartVisit(patient.id, patient.name)}
                disabled={isVisited}
                className={`flex-1 h-10 rounded-lg shadow-sm transition-colors ${isVisited ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : theme.button}`} size="sm">
               {isVisited ? 'Visit Completed' : 'Start Visit'}
            </Button>
            <Button 
                variant="outline" 
                size="sm" 
                className="h-10 w-10 p-0 rounded-lg text-slate-600 border-slate-200 bg-white/50"
                onClick={() => setSelectedHistoryPatient(patient)}
            >
                <FileText className="w-4 h-4" />
            </Button>
             <Button 
                variant="outline" 
                size="sm" 
                className={`h-10 px-3 rounded-lg border-slate-200 ${expandedId === patient.id ? 'bg-white text-slate-900 shadow-inner' : 'bg-white/50 text-slate-600'}`}
                onClick={() => toggleExpand(patient.id)}
            >
               {expandedId === patient.id ? 'Hide' : 'Info'}
            </Button>
            <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-lg text-slate-600 border-slate-200 bg-white/50">
                <Phone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )})}
      
      {isLoading && (
        <div className="text-center py-10 text-slate-500">
            Loading today's schedule...
        </div>
      )}

      {!isLoading && visits.length === 0 && (
          <div className="text-center py-10">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
              <p className="text-slate-500">No high-risk visits scheduled for today.</p>
          </div>
      )}

      {/* Chat History Modal */}
      {selectedHistoryPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
               <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600"/>
                    Chat History
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedHistoryPatient.name} • {selectedHistoryPatient.condition}
                  </p>
               </div>
               <Button variant="ghost" size="sm" onClick={() => setSelectedHistoryPatient(null)}>✕</Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
               {selectedHistoryPatient.today_aura ? (
                   // Real AURA Transcript for "Arun Singh"
                   selectedHistoryPatient.today_aura.transcript.map((msg, idx) => (
                       <div key={idx} className={`${msg.from === 'AURA' ? 'bg-slate-50 border-slate-100' : 'bg-blue-50 border-blue-100 ml-auto max-w-[85%]'} p-3 rounded-lg border`}>
                           <p className={`font-semibold text-xs ${msg.from === 'AURA' ? 'text-blue-600' : 'text-blue-800 text-right'} mb-1`}>
                               {msg.from === 'AURA' ? 'AURA (AI)' : 'Patient'} • {msg.time}
                           </p>
                           <p className="text-sm text-slate-800">{msg.text}</p>
                       </div>
                   ))
               ) : (
                   // Fallback Mock Transcript for others
                   <>
                       <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="font-semibold text-xs text-blue-600 mb-1">MediBot • 10:00 AM</p>
                          <p className="text-sm text-slate-700">Hello! How are you feeling today?</p>
                       </div>
                       <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 ml-auto max-w-[85%]">
                           <p className="font-semibold text-xs text-blue-800 mb-1 text-right">Patient • 10:01 AM</p>
                           {selectedHistoryPatient.risk > 50 ? (
                               <p className="text-sm text-slate-800">I'm in a lot of pain. My wound feels hot.</p>
                           ) : (
                               <p className="text-sm text-slate-800">I am feeling better today. No pain.</p>
                           )}
                       </div>
                   </>
               )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end">
                <Button className="w-full" onClick={() => setSelectedHistoryPatient(null)}>Close History</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
