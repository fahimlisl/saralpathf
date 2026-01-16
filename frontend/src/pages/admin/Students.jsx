import { useEffect, useState } from "react"
import {
  fetchAllStudents,
  fetchParticularStudent,
  generateStudentMarksheet,
  registerStudent
} from "../../services/adminService"
import { Eye, Wallet, FileText, Plus } from "lucide-react"


function formatFeeName(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())
}

function getStudentClassLabel(student) {
  if (student.classCurrent && student.typeOfClass) {
    return `${student.classCurrent} ${student.typeOfClass}`.trim()
  }
  if (student.classCurrent) return `${student.classCurrent}`
  if (student.typeOfClass) return student.typeOfClass
  return ""
}

function formatPrettyDate(dateString) {
  if (!dateString) return "—"
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString("en-IN", { month: "long" })
  const year = date.getFullYear()

  const suffix =
    day >= 11 && day <= 13 ? "th"
      : day % 10 === 1 ? "st"
      : day % 10 === 2 ? "nd"
      : day % 10 === 3 ? "rd"
      : "th"

  return `${day}${suffix} of ${month} ${year}`
}

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [viewMode, setViewMode] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)

  const loadStudents = async () => {
    try {
      const res = await fetchAllStudents()
      setStudents(res.data.data)
    } catch (err) {
      console.error("Failed to fetch students", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const openModal = async (id, mode) => {
    try {
      setDetailsLoading(true)
      setViewMode(mode)
      const res = await fetchParticularStudent(id)
      setSelectedStudent(res.data.data)
    } catch (err) {
      console.error("Failed to fetch student details", err)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleMarksheet = async (studentId) => {
    try {
      const res = await generateStudentMarksheet(studentId)
      const file = new Blob([res.data], { type: "application/pdf" })
      const fileURL = URL.createObjectURL(file)
      window.open(fileURL)
    } catch (err) {
      console.error("Failed to generate marksheet", err)
      alert("Failed to generate marksheet PDF")
    }
  }

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-500 mt-1">Manage student profiles, fees and marksheets</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Section</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10">Loading students...</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{student.fullName}</p>
                    <p className="text-sm text-gray-500">{student.email || "—"}</p>
                  </td>
                  <td className="px-6 py-4">{student.phoneNumber}</td>
                  <td className="px-6 py-4">{student.section || "—"}</td>
                  <td className="px-6 py-4">{getStudentClassLabel(student)}</td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <ActionBtn icon={<Eye size={18} />} label="Profile" onClick={() => openModal(student._id, "profile")} />
                      <ActionBtn icon={<Wallet size={18} />} label="Fees" onClick={() => openModal(student._id, "fees")} />
                      <ActionBtn icon={<FileText size={18} />} label="Marksheet" onClick={() => handleMarksheet(student._id)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          mode={viewMode}
          loading={detailsLoading}
          onClose={() => {
            setSelectedStudent(null)
            setViewMode(null)
          }}
        />
      )}

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadStudents}
        />
      )}
    </div>
  )
}

function AddStudentModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    section: "",
    gurdianName: "",
    classCurrent: "",
    typeOfClass: "",
    monthlyFees: "",
    admissionFee: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      await registerStudent(form)
      alert("Student registered successfully")
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      alert("Failed to register student")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">

        <button onClick={onClose} className="absolute top-4 right-4 text-xl">✕</button>

        <h2 className="text-2xl font-bold mb-6">Register New Student</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <Input label="Full Name" name="fullName" onChange={handleChange} />
          <Input label="Email" name="email" onChange={handleChange} />
          <Input label="Phone" name="phoneNumber" onChange={handleChange} />
          <Input label="Birth Date" type="date" name="birthDate" onChange={handleChange} />
          <Input label="Section" name="section" onChange={handleChange} />
          <Input label="Guardian Name" name="gurdianName" onChange={handleChange} />
          <Input label="Class" name="classCurrent" onChange={handleChange} />
          <Input label="Type Of Class" name="typeOfClass" onChange={handleChange} />
          <Input label="Monthly Fees" name="monthlyFees" onChange={handleChange} />
          <Input label="Admission Fee" name="admissionFee" onChange={handleChange} />

        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Register Student
        </button>
      </div>
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <input
        {...props}
        className="w-full border rounded-lg px-4 py-2"
      />
    </div>
  )
}

function ActionBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-gray-100">
      {icon} {label}
    </button>
  )
}

function StudentModal({ student, mode, loading, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">✕</button>
        <h2 className="text-2xl font-bold mb-6">{mode === "profile" ? "Student Profile" : "Student Fees"}</h2>
        {loading ? <p>Loading...</p> : mode === "profile" ? <ProfileView student={student} /> : <FeesView student={student} />}
      </div>
    </div>
  )
}

function ProfileView({ student }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Detail label="Full Name" value={student.fullName} />
      <Detail label="Phone" value={student.phoneNumber} />
      <Detail label="Email" value={student.email || "—"} />
      <Detail label="Section" value={student.section || "—"} />
      <Detail label="Class" value={getStudentClassLabel(student)} />
      <Detail label="DOB" value={formatPrettyDate(student.birthDate)} />
      <Detail label="Guardian" value={student.gurdianName || "—"} />
    </div>
  )
}

function FeesView({ student }) {
  const feeEntries = Object.entries(student.fees || {})

  const totalFees = feeEntries.reduce((sum, [, fee]) => sum + (fee.amount || 0), 0)
  const paidFees = feeEntries
    .filter(([, fee]) => fee.isPaid)
    .reduce((sum, [, fee]) => sum + (fee.amount || 0), 0)

  const pendingFees = totalFees - paidFees

  return (
    <div className="space-y-8">

      <div className="grid md:grid-cols-3 gap-6">
        <FeeSummaryCard title="Total Fees" value={totalFees} color="blue" />
        <FeeSummaryCard title="Paid" value={paidFees} color="green" />
        <FeeSummaryCard title="Pending" value={pendingFees} color="red" />
      </div>

      <div className="bg-gray-50 rounded-xl border">

        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Fee Breakdown</h3>
        </div>

        <div className="max-h-[350px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white border-b">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-3">Fee Type</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {feeEntries.map(([key, fee]) => (
                <tr key={key} className="border-b hover:bg-white transition">
                  <td className="px-6 py-3 font-medium">
                    {formatFeeName(key)}
                  </td>

                  <td className="px-6 py-3 font-semibold">
                    ₹ {fee.amount || 0}
                  </td>

                  <td className="px-6 py-3">
                    <StatusBadge paid={fee.isPaid} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}


function Detail({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function FeeSummaryCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm flex justify-between items-center">
      <div>
        <p className="text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">₹ {value}</h3>
      </div>
      <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${colors[color]}`}>
        {title}
      </div>
    </div>
  )
}

function StatusBadge({ paid }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {paid ? "PAID" : "PENDING"}
    </span>
  )
}
