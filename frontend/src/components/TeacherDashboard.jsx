import { useEffect, useState } from "react"
import { fetchAssignedStudents, updateMarks } from "../services/teacherService"
import { CheckCircle, Clock, Save, Users } from "lucide-react"


export default function TeacherDashboard() {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedClass, setSelectedClass] = useState("all")

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const res = await fetchAssignedStudents()
      setStudents(res.data.data)
      setFilteredStudents(res.data.data)
    } catch (err) {
      console.error("Failed to load students", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedClass === "all") {
      setFilteredStudents(students)
    } else {
      setFilteredStudents(
        students.filter(s => String(s.classCurrent) === selectedClass)
      )
    }
  }, [selectedClass, students])

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:px-8">

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your assigned students & marks
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div className="flex items-center gap-3">
          <Users className="text-blue-600" />
          <span className="font-semibold text-lg">
            {filteredStudents.length} Students
          </span>
        </div>

        <select
          className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="all">All Classes</option>

          <option value="3">Class 3</option>
          <option value="4">Class 4</option>
          <option value="5">Class 5</option>
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
          <option value="9">Class 9</option>

          <option value="71">Jamiah 7</option>
          <option value="81">Jamiah 8</option>
          <option value="91">Jamiah 9</option>

          <option value="15">Hifz-A</option>
          <option value="11">Edadiah-I</option>
          <option value="12">Edadiah-II</option>
          <option value="13">Edadiah-III</option>
          <option value="22">Rapid</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          Loading assigned students...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          No students found for this class
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredStudents.map(student => (
            <StudentCard
              key={student._id}
              student={student}
              onUpdated={loadStudents}
            />
          ))}
        </div>
      )}

    </div>
  )
}


function StudentCard({ student, onUpdated }) {
  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
        <h2 className="text-xl font-bold">{student.fullName}</h2>
        <p className="text-sm opacity-90">Section: {student.section}</p>
      </div>

      <div className="p-5 space-y-6">
        {student.marksheet.terms.map(term => (
          <TermBlock
            key={term.term}
            term={term}
            onUpdated={onUpdated}
          />
        ))}
      </div>

    </div>
  )
}


function TermBlock({ term, onUpdated }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        Term {term.term}
      </h3>

      <div className="space-y-3">
        {term.subjects.map(subject => (
          <SubjectRow
            key={subject._id}
            subject={subject}
            term={term.term}
            onUpdated={onUpdated}
          />
        ))}
      </div>
    </div>
  )
}


function SubjectRow({ subject, term, onUpdated }) {
  const [marks, setMarks] = useState(subject.obtainedMarks || "")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (marks === "") return alert("Enter marks")

    try {
      setSaving(true)

      await updateMarks(subject._id, {
        term,
        obtainedMarks: Number(marks)
      })

      onUpdated()
    } catch (err) {
      alert("Failed to submit marks")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div>
        <h4 className="font-semibold">{subject.subjectName}</h4>
        <p className="text-sm text-gray-500">
          Max Marks: {subject.maxMarks}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">

        {subject.isSubmitted ? (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
            <CheckCircle size={16} /> Submitted
          </span>
        ) : (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
            <Clock size={16} /> Pending
          </span>
        )}

        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          className="border rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          disabled={saving}
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save"}
        </button>

      </div>
    </div>
  )
}
