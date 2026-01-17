import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
})

export const fetchAssignedStudents = () =>
  API.get("/teacher/fetchAssignedStudents")

export const updateMarks = (subjectId, data) =>
  API.patch(`/teacher/updateMarks/${subjectId}`, data)
