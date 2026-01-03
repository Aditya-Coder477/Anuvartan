"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="bg-dashboard-bg text-gray-800 antialiased min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* BEGIN: Main Container */}
      <main className="w-full max-w-[1100px] space-y-8">
        
        {/* BEGIN: Header Section */}
        <header className="text-left space-y-2 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">Anuvartan Healthcare Dashboard</h1>
          <p className="text-gray-600 max-w-2xl text-sm sm:text-base leading-relaxed">
            Experience the future of healthcare coordination. Seamlessly connecting patients, doctors, and nurses.
          </p>
        </header>
        {/* END: Header Section */}

        {/* BEGIN: Top Statistics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Active Patients Trend */}
          <div className="bg-white rounded-xl soft-shadow flex flex-col h-full border border-gray-100 p-8">
            <div className="mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Active Patients Trend</h2>
            </div>
            {/* Chart Content */}
            <div className="flex-grow flex flex-col items-center justify-center relative">
              {/* Numerical Overlay */}
              <div className="absolute top-0 text-center z-10 w-full mt-2">
                <span className="block font-bold text-gray-900 text-4xl">1,250</span>
                <span className="text-xs text-gray-500">(Today)</span>
              </div>
              {/* Image Placeholder */}
              <div className="w-full h-40 mt-6 relative overflow-hidden flex items-end justify-center">
                <img 
                    alt="Line Chart showing patient trends" 
                    className="w-full object-contain object-bottom" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtVQGATTo9Dl-I4grOzaqZgQGR1483aUltHwfLHjIjwC43Eud6B2vJm5_cLgP9BDuUQ1TIIiTpmoCirAYsfitF4BIV4cJX0NkuYKsJVgplLBEizDr7uoLW2chg1OKdQ-yJd_766_kcTzvY1QZ8kE07xA14JhMA-sNI4uLevSXFVwak5XfYjAjWMXAE6QGAyf-64UZwxAi1X3GJ5qSjgKJeWl73YXD-wkZIUwPv2jEHGuFsRUm7Bq57M5RHMI3YVogtYjS_gr7-98g"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Pending Alerts by Priority */}
          <div className="bg-white rounded-xl soft-shadow flex flex-col h-full border border-gray-100 p-8">
            <div className="mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Pending Alerts by Priority</h2>
            </div>
            {/* Custom Bar Chart Representation */}
            <div className="flex-grow flex flex-col justify-center gap-3 mb-6">
                <div className="flex flex-col justify-center gap-4 mb-6 w-full">
                    {/* High */}
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-sm font-medium w-14 text-gray-600 shrink-0">High</span>
                        <div className="flex-grow h-8 bg-gray-100 rounded overflow-hidden">
                            <div className="h-full bg-alert-red" style={{ width: '70%' }}></div>
                        </div>
                        <span className="text-sm font-bold w-6 text-right shrink-0">5</span>
                    </div>
                    {/* Medium */}
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-sm font-medium w-14 text-gray-600 shrink-0">Medium</span>
                        <div className="flex-grow h-8 bg-gray-100 rounded overflow-hidden">
                            <div className="h-full bg-alert-orange" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-bold w-6 text-right shrink-0">7</span>
                    </div>
                    {/* Low */}
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-sm font-medium w-14 text-gray-600 shrink-0">Low</span>
                        <div className="flex-grow h-8 bg-gray-100 rounded overflow-hidden">
                            <div className="h-full bg-alert-green" style={{ width: '40%' }}></div>
                        </div>
                        <span className="text-sm font-bold w-6 text-right shrink-0">3</span>
                    </div>
                </div>
            </div>
            <button className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white font-medium py-2 rounded-lg transition-colors shadow-sm">
              Resolve
            </button>
          </div>

          {/* Card 3: Appointments Status */}
          <div className="bg-white rounded-xl soft-shadow flex flex-col h-full border border-gray-100 p-8">
            <div className="mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Appointments Status</h2>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center">
              {/* Donut Chart Placeholder */}
              <div className="relative w-32 h-32 mb-6">
                <img 
                    alt="Donut Chart showing appointment status" 
                    className="w-full h-full object-contain rounded-full" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNeett6Ccg0UyeR_TRwiObzv0PNVtsJlQ_9ZoH0chjEjmbGc7v1uJxHgtjFKkSAzl6UucYDYw485OCJeOUXgMGgpeByynqnHrq6kMjITs2xLgp6cE-0V7ROLlYY5EndfEMcSL4IOzTViOn76Jth88ygZj37yt9z8nyEcEQunKDxzS-uAV5T17zbyk4KnCZ4_yoR-ItV4WSylG6ItrWi8Wgtd68caZfttRqMnhwKY71eq0qJwBRvXmlft_sa8iOFYz00954uVOLKPk"
                />
                {/* Text Overlay inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-center pointer-events-none">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Progress</span>
                    <span className="text-xl font-bold text-gray-900">(30/48)</span>
                </div>
              </div>
              {/* Legend */}
              <div className="w-full space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-blue block"></span>
                  <span className="text-gray-700">Completed (30/48)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-300 block"></span>
                  <span className="text-gray-700">Remaining (18)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: Top Statistics Grid */}

        {/* BEGIN: Detailed Feature Cards */}
        <section className="space-y-6">
          
          {/* Card A: Patient Portal */}
          <article className="bg-white rounded-xl soft-shadow overflow-hidden flex flex-col md:flex-row border border-gray-100">
            {/* Left Panel */}
            <div className="w-full md:w-[30%] left-panel-gradient p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24">
                <img 
                    alt="Patient Group Icon" 
                    className="w-full h-full object-contain drop-shadow-md" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDNuW7g8P1JnX3YNF6Vo2S3FaKIjyCsQZ0phCZB-mXoj2OJR3Y1K9RcBsow3h18DMisjW_BXGb6bY_zpkw2T8Kj9RvNYsq2pOkwFaVYgFsAp8XB-bxRZ55Nbl0Vhovp2jGFaDGAgqgiQSbKMFmPU8vLpRRTOtwoOWvGR3wlv924N0O5qoQbveMIvLPLlkr3IX59JJEqgCAYq_cEXBvhKzu8sVq0VV2dAVmsgzzoVz3WZjG3_dOwF59B00AUf-CmTakqhoTZ-GgYGw"
                />
              </div>
              <p className="font-bold text-lg text-gray-900">3 New Check-ins</p>
            </div>
            {/* Right Panel */}
            <div className="w-full md:w-[70%] p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Portal</h3>
              <p className="text-gray-600 mb-6 text-sm">Chat with our AI assistant, check-in daily, and upload progress photos.</p>
              <div className="flex flex-wrap gap-4 items-center">
                {/* Action Buttons Group */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                   <Link href="/patient" className="w-full sm:w-auto">
                      <button className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-sm w-full sm:w-auto">
                        AI Chat
                      </button>
                   </Link>
                   <Link href="/patient" className="w-full sm:w-auto">
                      <button className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-sm w-full sm:w-auto">
                        Upload Photo
                      </button>
                   </Link>
                </div>
                <Link href="/patient" className="w-full sm:w-auto ml-0 sm:ml-auto">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-6 py-2 rounded-lg text-sm font-medium transition w-full sm:w-auto">
                        View Portal
                    </button>
                </Link>
              </div>
            </div>
          </article>

          {/* Card B: Doctor Dashboard */}
          <article className="bg-white rounded-xl soft-shadow overflow-hidden flex flex-col md:flex-row border border-gray-100">
            {/* Left Panel */}
            <div className="w-full md:w-[30%] left-panel-gradient p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 mb-4 overflow-hidden relative">
                <img 
                    alt="Stethoscope Icon" 
                    className="w-full h-full object-cover object-top drop-shadow-md" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIGrJZ5GujKKkgGdDiFrNL8mLkxbYHYrkv2rdoHoj4dsWXwPmzuXMjbyug77MwbgDpFfE41LNVwSklVz2NiGrmF5BI3Ub94ExnPuLaOCd91RBGZTN6okF1G55LjEQ3DsAjdvBp18GnPwlavFtBZ4MlddMZEKlpmk4lJ2fbnVuG1avFNAvEbgB4Nmpv_AR3EZGBVOIB7SbIp0vnP1mpWO-XTUm9GVOV82s3lLX6VRbhzKy-_6KGMXubNVPeFOnCAAmg0VUMg7tW3n4"
                />
              </div>
              <p className="font-bold text-lg text-gray-900 leading-tight">5 High-Risk Patients</p>
              <p className="font-bold text-lg text-gray-900 leading-tight">12 Reviews Pending</p>
            </div>
            {/* Right Panel */}
            <div className="w-full md:w-[70%] p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Doctor Dashboard</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-8 mb-4">
                <div><span className="font-bold text-gray-900">5</span> <span className="text-gray-600">High-Risk Patients</span></div>
                <div><span className="font-bold text-gray-900">12</span> <span className="text-gray-600">Reviews Pending</span></div>
              </div>
              <p className="text-gray-600 mb-6 text-sm">Review high-risk patients, access chat transcripts, and monitor cohort health.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Row 1 Buttons */}
                <Link href="/doctor" className="w-full">
                    <button className="bg-primary-blue hover:bg-primary-blue-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm w-full">
                        Review All
                    </button>
                </Link>
                <Link href="/doctor" className="w-full">
                    <button className="bg-primary-blue hover:bg-primary-blue-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm w-full">
                        Cohort Health
                    </button>
                </Link>
                {/* Row 2 Buttons */}
                <Link href="/doctor" className="w-full">
                    <button className="bg-primary-blue hover:bg-primary-blue-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm w-full">
                         View Reports
                    </button>
                </Link>
                <Link href="/doctor" className="w-full">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition w-full">
                        View Dashboard
                    </button>
                </Link>
              </div>
            </div>
          </article>

          {/* Card C: Nurse View */}
          <article className="bg-white rounded-xl soft-shadow overflow-hidden flex flex-col md:flex-row border border-gray-100">
            {/* Left Panel */}
            <div className="w-full md:w-[30%] left-panel-gradient p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24">
                <img 
                    alt="Heart and Map Icon" 
                    className="w-full h-full object-contain drop-shadow-md" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAIYfJOVt-m8cJRVliap5KlUQzp0uknQkqsQNemKpT0TwGrpLWq6YbgfZzlMr6TqNwYYyJSJYQCBAlF75M_HIouTTIRGABYPq_Tku_yIfyTVAIG06Ss9EPjOXLDmL8p1wM2Ca1dMV9zRLlibdLcJgHaAflJYaoJRAyNI3OPj13Da4A1U8BO268zRtMYwZi0am-JOM7EtCHegU8kw0NCqaAXVyumstJFRkf0r0UC8nCwSgK-FFt8gDctJQNj4BWZ_asKn3POjqc6FA"
                />
              </div>
              <p className="font-bold text-lg text-gray-900">8 Visits Pending</p>
            </div>
            {/* Right Panel */}
            <div className="w-full md:w-[70%] p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nurse View</h3>
              <p className="text-gray-600 mb-6 text-sm">Mobile-optimized daily visit list for high-risk patients nearby.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                 <Link href="/nurse" className="w-full sm:w-auto">
                    <button className="bg-primary-blue hover:bg-primary-blue-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm w-full sm:w-auto">
                        Start Route
                    </button>
                 </Link>
                 <Link href="/nurse" className="w-full sm:w-auto">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition w-full sm:w-auto">
                        Nearby Patients
                    </button>
                 </Link>
                 <Link href="/nurse" className="w-full sm:w-auto">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition w-full sm:w-auto">
                        View List
                    </button>
                 </Link>
              </div>
            </div>
          </article>

        </section>
        {/* END: Detailed Feature Cards */}

        {/* BEGIN: Footer */}
        <footer className="pt-8 pb-4 text-center">
          <p className="text-sm text-gray-500 font-medium">© 2024 Anuvartan Healthcare</p>
        </footer>
        {/* END: Footer */}

      </main>
      {/* END: Main Container */}
    </div>
  )
}
