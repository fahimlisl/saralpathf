import { useEffect, useState } from "react"
import { fetchStudentProfile, generateStudentMarksheet } from "../services/studentService.js"
import { FileText, User, BookOpen, Wallet } from "lucide-react"

export default function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const studentId = JSON.parse(localStorage.getItem("student"))?._id
      console.log(studentId)
      if (!studentId) return
      
      const res = await fetchStudentProfile(studentId)
      console.log(res)
      setStudent(res.data.data)
    } catch (err) {
      console.error("Failed to load student profile", err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarksheet = async () => {
    try {
      const res = await generateStudentMarksheet(student._id)
      const file = new Blob([res.data], { type: "application/pdf" })
      const url = URL.createObjectURL(file)
      window.open(url)
    } catch (err) {
      alert("Failed to open marksheet")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-10">

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-10 rounded-3xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome, {student.fullName}
        </h1>
        <p className="mt-2 text-blue-100">
          Class {student.classCurrent} {student.typeOfClass} • Section {student.section}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard icon={<User size={26} />} title="Guardian" value={student.gurdianName} />
        <StatCard icon={<BookOpen size={26} />} title="Subjects" value={student.marksheet?.terms?.[0]?.subjects?.length || 0} />
        <StatCard icon={<Wallet size={26} />} title="Pending Fees" value={getPendingFees(student.fees)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-4">
          <h2 className="text-xl font-bold mb-4">Student Profile</h2>
          <ProfileRow label="Full Name" value={student.fullName} />
          <ProfileRow label="Phone" value={student.phoneNumber} />
          <ProfileRow label="Email" value={student.email || "-"} />
          <ProfileRow label="DOB" value={new Date(student.birthDate).toLocaleDateString("en-IN")} />
          <ProfileRow label="Guardian" value={student.gurdianName} />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-4 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Fee Status</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(student.fees).slice(0, 12).map(([key, fee]) => (
              <FeeCard key={key} month={key} fee={fee} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Academic Marksheet</h2>
          <p className="text-gray-500 mt-1">Download your latest marksheet</p>
        </div>

        <button
          onClick={handleMarksheet}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-blue-700"
        >
          <FileText size={20} />
          View Marksheet
        </button>
      </div>
    </div>
  )
}


function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl flex gap-5 items-center">
      <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">{icon}</div>
      <div>
        <p className="text-gray-500">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  )
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function FeeCard({ month, fee }) {
  return (
    <div className="border rounded-xl p-5 flex justify-between items-center">
      <span className="capitalize font-medium">{month}</span>
      {fee.isPaid ? (
        <span className="text-green-600 font-semibold">Paid</span>
      ) : (
        <span className="text-red-600 font-semibold">Unpaid</span>
      )}
    </div>
  )
}

function getPendingFees(fees) {
  let count = 0
  Object.values(fees).forEach(f => {
    if (!f.isPaid) count++
  })
  return count
}
