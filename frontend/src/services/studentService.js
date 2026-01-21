import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
})

export const fetchStudentProfile = (id) =>
  API.get(`/student/profile/${id}`)

export const generateStudentMarksheet = (studentId) =>
  API.get(`/student/marksheet/${studentId}`, { responseType: "blob" })
