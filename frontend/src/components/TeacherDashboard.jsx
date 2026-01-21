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
        students.filter(s => String(s.classCurrent) === String(selectedClass))
      )
    }
  }, [selectedClass, students])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-6 md:px-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your assigned students & marks
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Students</p>
            <h2 className="text-2xl font-bold">{filteredStudents.length}</h2>
          </div>
        </div>

        <select
          className="border rounded-xl px-5 py-3 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="all">All Classes</option>

          <optgroup label="School Classes">
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
            <option value="5">Class 5</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
          </optgroup>

          <optgroup label="Jamiah">
            <option value="71">Jamiah 7</option>
            <option value="81">Jamiah 8</option>
            <option value="91">Jamiah 9</option>
          </optgroup>

          <optgroup label="Special">
            <option value="15">Hifz-A</option>
            <option value="11">Edadiah-I</option>
            <option value="12">Edadiah-II</option>
            <option value="13">Edadiah-III</option>
            <option value="22">Rapid</option>
          </optgroup>
        </select>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl shadow text-center text-lg">
          Loading assigned students...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow text-center text-lg text-gray-500">
          No students found for this class
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
        <h2 className="text-xl font-bold">{student.fullName}</h2>

        <div className="flex flex-wrap gap-4 mt-2 text-sm opacity-90">
          <span>Section: {student.section}</span>
          <span>
            Class: {student.typeOfClass} {student.classCurrent}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-8">
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
      <h3 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">
        Term {term.term}
      </h3>

      <div className="space-y-4">
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
    <div className="border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-gray-50">

      <div>
        <h4 className="font-semibold text-gray-800">{subject.subjectName}</h4>
        <p className="text-sm text-gray-500">
          Max Marks: {subject.maxMarks}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">

        {subject.isSubmitted ? (
          <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
            <CheckCircle size={16} /> Submitted
          </span>
        ) : (
          <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
            <Clock size={16} /> Pending
          </span>
        )}

        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          className="border rounded-lg px-4 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          disabled={saving}
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition shadow"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save"}
        </button>

      </div>
    </div>
  )
}
