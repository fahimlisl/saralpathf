import { useEffect, useState } from "react"
import { fetchAdmissionStatus } from "../services/settingsService"
import OnlineForm from "./OnlineForm.jsx"
import AdmissionNotice from "./AdmissionNotice.jsx"

export default function Admissions() {
  const [loading, setLoading] = useState(true)
  const [onlineAdmission, setOnlineAdmission] = useState(false)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      const res = await fetchAdmissionStatus()
      const status = res.data.data[0].onlineAdmission  
      setOnlineAdmission(status)
    } catch (err) {
      console.error("Failed to load admission status", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-lg">
        Loading admission status...
      </div>
    )
  }

  return (
    <div className="pt-28">
      {onlineAdmission ? <OnlineForm /> : <AdmissionNotice />}
    </div>
  )
}
