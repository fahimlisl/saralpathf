import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
})

export const fetchAdmissionStatus = () => {
  return API.get("/general/fetchSettingsStatus")
}

export const updateOnlineAdmission = (onlineAdmission) => {
  return API.patch("/admin/updateOnlineAdmission", { onlineAdmission })
}