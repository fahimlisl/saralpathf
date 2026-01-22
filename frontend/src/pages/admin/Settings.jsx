import { useEffect, useState } from "react"
import { fetchAdmissionStatus, updateOnlineAdmission } from "../../services/settingsService"
import { Shield, ToggleLeft, ToggleRight } from "lucide-react"

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [onlineAdmission, setOnlineAdmission] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const res = await fetchAdmissionStatus()
      setOnlineAdmission(res.data.data[0].onlineAdmission)
    } catch (err) {
      console.error("Failed to load settings", err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    try {
      setSaving(true)
      const newValue = !onlineAdmission

      await updateOnlineAdmission(newValue)
      setOnlineAdmission(newValue)
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update setting")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg">
        Loading settings...
      </div>
    )
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="text-blue-600" />
          Site Settings
        </h1>
        <p className="text-gray-500 mt-2">
          Control public site features and access
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold">Online Admission</h2>
            <p className="text-gray-500 mt-1">
              Enable or disable online admission form
            </p>
          </div>

          <button
            onClick={handleToggle}
            disabled={saving}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition ${
              onlineAdmission
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            {onlineAdmission ? (
              <>
                <ToggleRight size={26} />
                Enabled
              </>
            ) : (
              <>
                <ToggleLeft size={26} />
                Disabled
              </>
            )}
          </button>

        </div>

        <div className="mt-6 p-4 rounded-xl bg-gray-50 border">
          <p className="font-medium">
            Current Status :
            <span className={`ml-2 font-bold ${
              onlineAdmission ? "text-green-600" : "text-red-600"
            }`}>
              {onlineAdmission ? "ONLINE ADMISSION OPEN" : "ONLINE ADMISSION CLOSED"}
            </span>
          </p>
        </div>

      </div>
    </div>
  )
}
