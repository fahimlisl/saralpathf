import { useEffect, useState } from "react"
import { fetchAllTeachers, registerTeacher, editTeacher } from "../../services/adminService"
import { Plus, Pencil } from "lucide-react"



const SUBJECT_OPTIONS = [
  "Hifzul Qur'an 3","Hadith 3","Arabic Literature 3","English 3","Bengali 3","Mathematics 3","Environmental Science 3","Urdu 3","Dua 3",

  "Hifzul Qur'an 4","Hadith 4","Arabic Literature 4","English 4","Bengali 4","Mathematics 4","Environmental Science 4","Urdu 4","Dua 4","Diniyat 4","Qirat 4",

  "Hifzul Qur'an 5","Hadith 5","Arabic Literature 5","English 5","Bengali 5","Mathematics 5","Environmental Science 5","Urdu 5","Dua 5","Diniyat 5","Qirat 5",

  "Hifzul Qur'an 6","Hadith 6","Arabic Literature 6","English 6","Bengali 6","Mathematics 6","Environmental Science 6","Urdu 6","Diniyat 6","Qirat 6","Geography 6","History 6","Sarf 6","Nahu 6",

  "Hifzul Qur'an 7","Hadith 7","Tafseer 7","Aqeedah 7","English 7","Bengali 7","Mathematics 7","History 7","Environmental Science 7","Qirat 7","Geography 7",

  "Hifzul Qur'an 71","Hadith 71","Nahu 71","Sarf 71","Sirat 71","Aqeedah 71","English 71","Bengali 71","Mathematics 71","History 71","Environmental Science 71","Durusul Lugah 71","Geography 71","Arabic Lt + Insha 71",

  "Hifzul Qur'an 8","Hadith 8","Tafseer 8","Aqeedah 8","English 8","Bengali 8","Mathematics 8","History 8","Environmental Science 8","Qirat 8","Geography 8",

  "Hifzul Qur'an 81","Nahu 81","Sarf 81","Sirat 81","Tafseer 81","Aqeedah 81","English 81","Bengali 81","Mathematics 81","History 81","Environmental Science 81","Durusul Lugah 81","Geography 81","Arabic Lt + Insha 81","Hadith + Usule Hadith 81",

  "Hifzul Qur'an 9","Hadith 9","Tafseer 9","Fiq 9","English 9","Bengali 9","Mathematics 9","History 9","Physical Science 9","Life Science 9","Qirat 9","Geography 9",

  "Hifzul Qur'an 91","Nahu 91","Sirat 91","Sarf 91","Aqeedah 91","English 91","Bengali 91","Mathematics 91","History 91","Physical Science 91","Life Science 91","Islamic History 91","Geography 91","Arabic Lt + Insha 91","Hadith + Usule Hadith 91","Fiqh + U.Fiqh 91","Durusul Lugah 91",

  "Hifzul Qur'an 22","Hadith 22","Nahu 22","Sarf 22","Sirat 22","Aqeedah 22","English 22","Bengali 22","Mathematics 22","History 22","Environmental Science 22","Durusul Lugah 22","Geography 22","Arabic Lt + Insha 22",

  "Hifzul Qur'an 11","Hadith 11","Nahu 11","Sarf 11","Sirat 11","Aqeedah 11","Durusul Lugah 11","Dua 11","Qasasun nabiyyen 11","Taisirul Arabiyyah+Insha 11","An Nahul Wazeh 11",

  "Hifzul Qur'an 12","Tafseer 12","Hadith 12","Nahu 12","Sarf 12","Sirat 12","Aqeedah 12","Durusul Lugah 12","Islamic History 12","An Nahul Wazeh 12","Quran Tarjuma 12","Taisirul Arabiyyah+Insha 12","Mantiq 12","Balagah 12","Azharul Arab 12","Hadith + Usule Hadith 12",

  "Hifzul Qur'an 13","Tafseer 13","Hadith 13","Nahu 13","Sarf 13","Sirat 13","Aqeedah 13","Fiq 13","Fiq + U.Fiq 13","U.Tafseer 13","Faraiz 13","Islamic History 13","An Nahul Wazeh 13","Insha 13","Balagah 13","Hadith + Usule Hadith 13",

  "Hifzul Qur'an 15","Bengali 15","English 15","Mathematics 15","Arabic Literature 15","Tajweed 15","Urdu 15"
]



export default function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAddModal, setShowAddModal] = useState(false)
  const [editData, setEditData] = useState(null)

  const loadTeachers = async () => {
    try {
      const res = await fetchAllTeachers()
      setTeachers(res.data.data)
    } catch (err) {
      console.error("Failed to fetch teachers", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeachers()
  }, [])

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teachers Management</h1>
          <p className="text-gray-500">Manage all teachers and subjects</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Teacher
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Subjects</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10">Loading teachers...</td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{teacher.fullName}</td>
                  <td className="px-6 py-4">{teacher.phoneNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {teacher.subject.map((sub, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditData(teacher)}
                      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <TeacherModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadTeachers}
        />
      )}

      {editData && (
        <TeacherModal
          editData={editData}
          onClose={() => setEditData(null)}
          onSuccess={loadTeachers}
        />
      )}

    </div>
  )
}

function TeacherModal({ onClose, onSuccess, editData }) {
  const [form, setForm] = useState({
    fullName: editData?.fullName || "",
    email: editData?.email || "",
    phoneNumber: editData?.phoneNumber || "",
    password: "",
    subject: editData?.subject || []
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addSubject = (sub) => {
    if (!form.subject.includes(sub)) {
      setForm({ ...form, subject: [...form.subject, sub] })
    }
  }

  const removeSubject = (sub) => {
    setForm({ ...form, subject: form.subject.filter(s => s !== sub) })
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        subject: form.subject
      }

      if (form.password.trim()) payload.password = form.password

      if (editData) {
        await editTeacher(editData._id, payload)
        alert("Teacher updated successfully")
      } else {
        await registerTeacher({ ...payload, password: form.password })
        alert("Teacher registered successfully")
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      alert("Operation failed")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">

        <button onClick={onClose} className="absolute top-4 right-4 text-xl">✕</button>

        <h2 className="text-2xl font-bold mb-6">
          {editData ? "Edit Teacher" : "Register New Teacher"}
        </h2>

        <div className="grid gap-4">

          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          <Input label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          <Input
            label={editData ? "New Password (optional)" : "Password"}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <div>
            <p className="text-sm text-gray-500 mb-1">Select Subjects</p>

            <select
              onChange={(e) => addSubject(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              value=""
            >
              <option value="">Select a subject</option>
              {SUBJECT_OPTIONS.map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {form.subject.map((sub, i) => (
              <span
                key={i}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {sub}
                <button
                  onClick={() => removeSubject(sub)}
                  className="text-red-500 font-bold"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          {editData ? "Update Teacher" : "Register Teacher"}
        </button>

      </div>
    </div>
  )
}


function Input({ label, ...props }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <input {...props} className="w-full border rounded-lg px-4 py-2" />
    </div>
  )
}
