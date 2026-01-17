import { useEffect, useState } from "react"
import {
  fetchCurrentMonthFeeStatus,
  collectStudentFee,
  previewInvoice,
  fetchAllStudents,
  fetchParticularStudent
} from "../../services/adminService"
import { Wallet, Eye, FileText } from "lucide-react"

export default function Fees() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const [notPaidCount, setNotPaidCount] = useState(0)
  const [paidCount, setPaidCount] = useState(0)

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [viewStudent, setViewStudent] = useState(null)

  const [search, setSearch] = useState("")
  const [onlyCurrentMonth, setOnlyCurrentMonth] = useState(false)

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ]

  const monthKeyMap = {
    January: "jan",
    February: "feb",
    March: "march",
    April: "april",
    May: "may",
    June: "jun",
    July: "july",
    August: "august",
    September: "september",
    October: "october",
    November: "november",
    December: "december"
  }

  const currentMonthName = monthNames[new Date().getMonth()]
  const currentMonthKey = monthKeyMap[currentMonthName]

  const loadAllStudents = async () => {
    try {
      setLoading(true)
      const res = await fetchAllStudents()
      setStudents(res.data.data)
    } catch (err) {
      console.error("Failed to load students", err)
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentMonthStatus = async () => {
    try {
      setLoading(true)
      const res = await fetchCurrentMonthFeeStatus()
      const [studentList, notPaid, paid] = res.data.data

      setStudents(studentList)
      setNotPaidCount(notPaid)
      setPaidCount(paid)
    } catch (err) {
      console.error("Failed to load fee status", err)
    } finally {
      setLoading(false)
    }
  }

  const loadMonthlyStats = async () => {
    try {
      const res = await fetchCurrentMonthFeeStatus()
      const [_, notPaid, paid] = res.data.data
      setNotPaidCount(notPaid)
      setPaidCount(paid)
    } catch (err) {
      console.error("Failed to load stats", err)
    }
  }

  useEffect(() => {
    loadAllStudents()
    loadMonthlyStats()
  }, [])

  useEffect(() => {
    if (onlyCurrentMonth) {
      loadCurrentMonthStatus()
    } else {
      loadAllStudents()
    }
  }, [onlyCurrentMonth])

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(search.toLowerCase())
  )


  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Fees Management</h1>
        <p className="text-gray-500 mt-1">Collect and manage student fees</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title={`${currentMonthName} Unpaid`} value={notPaidCount} color="red" />
        <StatCard title={`${currentMonthName} Paid`} value={paidCount} color="green" />
        <StatCard title="Total Students" value={students.length} color="blue" />
      </div>

      <div className="bg-white rounded-xl shadow p-6 flex flex-wrap gap-6 items-center">

        <input
          type="text"
          placeholder="Search student name..."
          className="border rounded-lg px-4 py-2 w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyCurrentMonth}
            onChange={(e) => setOnlyCurrentMonth(e.target.checked)}
          />
          <span className="font-medium">
            Show only {currentMonthName} unpaid students
          </span>
        </label>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4">Section</th>
              <th className="px-6 py-4">Monthly Fee</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center">
                  Loading students...
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => {
                const currentFee = student.fees?.[currentMonthKey]

                return (
                  <tr key={student._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">{student.fullName}</td>
                    <td className="px-6 py-4">{student.phoneNumber}</td>
                    <td className="px-6 py-4">
                      {student.classCurrent} {student.typeOfClass}
                    </td>

                    <td className="px-6 py-4">
                      {student.section}
                    </td>

                    <td className="px-6 py-4">
                      Monthly Fee: ₹{currentFee?.amount || 0}
                    </td>

                    <td className="px-6 py-4 text-right flex gap-3 justify-end">

                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                      >
                        <Wallet size={16} /> Collect
                      </button>

                      <button
                        onClick={() => setViewStudent(student._id)}
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                      >
                        <FileText size={16} /> View
                      </button>

                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <CollectFeeModal
          student={selectedStudent}
          currentMonthKey={currentMonthKey}
          onClose={() => setSelectedStudent(null)}
          onSuccess={() => {
            loadAllStudents()
            loadMonthlyStats()
          }}
        />
      )}

      {viewStudent && (
        <ViewFeeModal
          studentId={viewStudent}
          onClose={() => setViewStudent(null)}
        />
      )}

    </div>
  )
}


function CollectFeeModal({ student, currentMonthKey, onClose, onSuccess }) {
  const [form, setForm] = useState({
    input: currentMonthKey,
    fineAmount: "",
    discount: ""
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCollect = async () => {
    if (!form.input) return alert("Select fee type")

    try {
      setLoading(true)

      await collectStudentFee(student._id, {
        input: form.input,
        fineAmount: Number(form.fineAmount || 0),
        discount: Number(form.discount || 0)
      })

      setSuccess(true)
    } catch (err) {
      alert("Failed to collect fee")
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = async () => {
    const res = await previewInvoice(student._id, form.input)
    const file = new Blob([res.data], { type: "application/pdf" })
    const url = URL.createObjectURL(file)
    window.open(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-xl relative">

        <button onClick={onClose} className="absolute top-4 right-4 text-xl">✕</button>

        <h2 className="text-xl font-bold mb-4">
          Collect Fee — {student.fullName}
        </h2>

        {!success ? (
          <>
            <select
              className="border rounded-lg px-4 py-2 w-full mb-3"
              value={form.input}
              onChange={(e) => setForm({ ...form, input: e.target.value })}
            >
              <option value="">Select Fee</option>
              <option value="jan">January</option>
              <option value="feb">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="jun">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            </select>

            <input
              placeholder="Discount"
              className="border p-2 w-full mb-2"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />

            <input
              placeholder="Fine"
              className="border p-2 w-full mb-2"
              value={form.fineAmount}
              onChange={(e) => setForm({ ...form, fineAmount: e.target.value })}
            />

            <button
              disabled={loading}
              onClick={handleCollect}
              className="bg-blue-600 text-white w-full py-2 rounded-lg"
            >
              {loading ? "Collecting..." : "Collect Fee"}
            </button>
          </>
        ) : (
          <>
            <p className="text-green-600 font-semibold mb-4">
              Fee collected successfully
            </p>

            <button
              onClick={handlePreview}
              className="border px-4 py-2 rounded-lg w-full flex justify-center gap-2"
            >
              <Eye size={18} /> Preview Invoice
            </button>

            <button
              onClick={() => { onSuccess(); onClose(); }}
              className="bg-green-600 text-white w-full py-2 rounded-lg mt-3"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  )
}


function ViewFeeModal({ studentId, onClose }) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParticularStudent(studentId).then(res => {
      setStudent(res.data.data)
      setLoading(false)
    })
  }, [studentId])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-10 rounded-xl shadow-xl">
          Loading fee details...
        </div>
      </div>
    )
  }

  const feeEntries = Object.entries(student.fees || {})

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative overflow-hidden">

        <div className="flex justify-between items-center border-b px-8 py-5 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold">Fee Status</h2>
            <p className="text-gray-500 text-sm">
              {student.fullName} — Class {student.classCurrent} {student.typeOfClass}
            </p>
          </div>

          <button onClick={onClose} className="text-2xl hover:text-red-500 transition">✕</button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">

          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="px-4 py-3">Fee Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Fine</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {feeEntries.map(([key, fee]) => (
                <tr key={key}>
                  <td className="px-4 py-3 capitalize">{key}</td>
                  <td className="px-4 py-3">₹{fee.amount || 0}</td>
                  <td className="px-4 py-3">₹{fee.discount || 0}</td>
                  <td className="px-4 py-3">₹{fee.fine || 0}</td>
                  <td className="px-4 py-3 font-semibold">₹{fee.amountPaid || 0}</td>
                  <td className="px-4 py-3">
                    {fee.paidDate ? new Date(fee.paidDate).toLocaleDateString("en-IN") : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {fee.isPaid ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                        PAID
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-semibold">
                        UNPAID
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}


function StatCard({ title, value, color }) {
  const colors = {
    red: "bg-red-100 text-red-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700"
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm flex justify-between items-center">
      <div>
        <p className="text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${colors[color]}`}>
        {title}
      </div>
    </div>
  )
}
