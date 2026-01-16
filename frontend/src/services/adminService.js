import axios from "axios"

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  withCredentials: true
})

// students
export const fetchAllStudents = () => API.get("/admin/fetchAllStudents")
export const countStudents = () => API.get("/admin/countStudent")
export const fetchParticularStudent = (id) =>
  API.get(`/admin/fetchParticularStudent/${id}`)
export const generateStudentMarksheet = (studentId) =>
  API.get(`/admin/marksheet/${studentId}`, { responseType: "blob" })
export const registerStudent = (data) => API.post("/admin/register-student",data)



// teacher thing starts here
export const fetchAllTeachers = () => API.get("/admin/fetchAllTeacher")
export const registerTeacher = (data) => API.post("/admin/register-teacher", data)
export const editTeacher = (id, data) => API.patch(`/admin/editTeacher/${id}`, data)
export const countTeacher = () => API.get("/admin/countTeacher")