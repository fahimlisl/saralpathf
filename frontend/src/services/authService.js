import axios from "axios"

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  withCredentials: true
})

export const loginAdmin = (data) => API.post("/admin/login", data)
export const loginTeacher = (data) => API.post("/teacher/login", data)
export const loginStudent = (data) => API.post("/student/login", data)
