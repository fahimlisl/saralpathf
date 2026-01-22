export default function AdmissionNotice() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-3xl bg-white shadow-2xl rounded-3xl p-12 text-center">

        <h1 className="text-4xl font-extrabold text-red-600">
          Admissions Closed
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Online admissions are currently closed.  
          Please visit the campus or contact the administration office
          for further information.
        </p>

        <div className="mt-8 text-gray-500">
          <p>📍 SaralPath Academy</p>
          <p>📞 +91 8514868658</p>
          <p>📧 saralpath2013@gmail.com</p>
        </div>

      </div>
    </div>
  )
}
